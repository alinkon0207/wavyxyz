import { useCallback, useEffect, useState } from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  WalletType,
} from "stellar-wallets-kit";
import {
  Server,
  Networks,
  Operation,
  BASE_FEE,
  TransactionBuilder,
  Asset,
} from "stellar-sdk";
import _get from "lodash/get";
import _find from "lodash/find";
import _forEach from "lodash/forEach";
import _map from "lodash/map";
import * as SorobanClient from "soroban-client";
import * as tokenSwap from "token_swap";

import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { changeConnect } from "redux/info";
import { calculateDecimalValue, calculateNonDecimalValue } from "utils/common";
import { createOffer, changeOffer, getOffer } from "services/firebase";
import { fetchRates } from "utils/exchange";

const OFFER_CREATE_ERRORS = {
  101: "Failed: Fee wasn't set",
  102: "Failed: Both tokens aren't allowed",
  104: "Failed: Zero amount is not allowed",
  105: "Failed: Min receive amount can't be greater than receive amount",
  106: "Failed: Insufficient balance",
  107: "Failed: Insufficient allowance",
};

const OFFER_ACCEPT_ERRORS = {
  110: "Failed: Can't find offer",
  111: "Failed: Fee isn't set",
  112: "Failed: Offer not available",
  113: "Failed: Amount is greater than max receive amount",
  114: "Failed: Amount must be more than min receive amount",
  115: "Failed: Insufficient balance",
  116: "Failed: Insufficient allowance",
};

const OFFER_UPDATE_ERRORS = {
  121: "Failed: Zero amount is not allowed",
  122: "Failed: Min receive amount can't be greater than receive amount",
  123: "Failed: Can't find offer",
  124: "Failed: Invalid offeror",
  125: "Failed: Offer not available",
};

const OFFER_CLOSE_ERRORS = {
  131: "Failed: Can't find offer",
  132: "Failed: Invalid offeror",
};

export default function useStellar() {
  const network = useAppSelector((state) => state.network);
  const { currency, connect: selectedWallet } = useAppSelector(
    (state) => state.info
  );

  const [server, setServer] = useState(
    new Server(
      network.chainId === 169
        ? "https://horizon.stellar.org"
        : "https://horizon-futurenet.stellar.org"
    )
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState("");

  const [tokenBalances, setTokenBalances] = useState<any>({});
  const [tokensBalanceFiat, setTokensBalanceFiat] = useState<any>({});
  const [totalBalance, setTotalBalance] = useState<any>(0);

  const [fees, setFees] = useState(0.05);

  const [rates, setRates] = useState({});

  const dispatch = useAppDispatch();
  const kit = new StellarWalletsKit({
    network: WalletNetwork.PUBLIC,
    selectedWallet: WalletType.FREIGHTER,
  });

  // Static
  const adminSecretKey =
    "SBAIJKOJ4K6X4MUAQU7SM3VOKQ3EF5OGJFBJTKDKHEMM4ONXBU6PS7AC";
  const feeSecretKey =
    "SAZ5QSUCVJ4RSXETP4GTQB2VRVDKNSSNR6J5GMIKLYDLOGV574IDMIBJ";

  const adminKeypair = SorobanClient.Keypair.fromSecret(adminSecretKey);
  const feeKeypair = SorobanClient.Keypair.fromSecret(feeSecretKey);
  const contract = new SorobanClient.Contract(tokenSwap.CONTRACT_ID);
  // Static
  const connect = async () => {
    await kit.openModal({
      onWalletSelected: async (option) => {
        let _publicKey;
        if (option.type === WalletType.WALLET_CONNECT) {
          try {
            await kit.startWalletConnect({
              name: "WAVY",
              description: "WAVY DAPP",
              url: "https://wavyxyz.netlify.app/",
              icons: ["URL_OF_ICON"],
              projectId: import.meta.env.VITE_WC_PROJECT_ID,
            });
            const sessions = await kit.getSessions();
            if (sessions.length) {
              await kit.setSession(sessions[0]?.id);
            } else {
              await kit.connectWalletConnect();
            }

            _publicKey = await kit?.getWalletConnectPublicKey();
          } catch (error) {}
        } else {
          await kit.setWallet(option.type);
          _publicKey = await kit.getPublicKey();
        }

        setAddress(_publicKey);
        setIsConnected(true);

        dispatch(changeConnect(option.type));
      },
    });
  };

  const getRates = useCallback(
    () => {
      fetchRates().then((res) => setRates(res));
    },

    // eslint-disable-next-line
    [network.sub]
  );

  const quoteSwap = async (from, to, fromAmount) => {
    try {
      await kit.setNetwork(WalletNetwork.PUBLIC);

      const fromContract = _find(
        network.token,
        function (o) {
          return o.contract.address === from;
        },
        "contract.name",
        ""
      );

      const toContract = _find(
        network.token,
        function (o) {
          return o.contract.address === to;
        },
        "contract.name",
        ""
      );

      const assetToSell = new Asset(fromContract.name, from);
      const assetToBuy = new Asset(toContract.name, to);

      const orderbook = await server.orderbook(assetToSell, assetToBuy).call();

      // The orderbook object contains the best bid and ask prices
      const bids = orderbook.bids;
      const asks = orderbook.asks;

      // The highest bid price (buy price) is the first element in the bids array
      const highestBidPrice =
        bids.length > 0 ? parseFloat(bids[0].price) : null;

      fromAmount = calculateDecimalValue(
        network.sub,
        Number(fromAmount),
        fromContract?.contract?.decimals || 18
      );

      if (highestBidPrice) {
        return Number(fromAmount) * highestBidPrice;
      }

      // The lowest ask price (sell price) is the first element in the asks array
      const lowestAskPrice = asks.length > 0 ? parseFloat(asks[0].price) : null;

      if (lowestAskPrice) {
        return Number(fromAmount) * lowestAskPrice;
      }

      throw new Error("No orders available on the order book.");
    } catch (error: any) {
      throw Error(error.message);
    }
  };

  const createSwap = async (from, to, fromAmount, slippage = 1) => {
    try {
      await kit.setNetwork(WalletNetwork.PUBLIC);
      
      const sellPrice = await quoteSwap(from, to, fromAmount);
      const sourceAccount = await server.loadAccount(address);
      const fromContract = _find(
        network.token,
        function (o) {
          return o.contract.address === from;
        },
        "contract.name",
        ""
      );

      const toContract = _find(
        network.token,
        function (o) {
          return o.contract.address === to;
        },
        "contract.name",
        ""
      );

      fromAmount = (calculateDecimalValue(
        network.sub,
        Number(fromAmount),
        fromContract?.contract?.decimals || 18
      ).toString());

      console.log(from, to, fromAmount);

      const assetToSell = new Asset(fromContract.name, from);
      const assetToBuy = new Asset(toContract.name, to);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.PUBLIC,
      })
        .addOperation(Operation.changeTrust({ asset: assetToBuy }))
        .addOperation(Operation.changeTrust({ asset: assetToSell }))
        .addOperation(
          Operation.manageSellOffer({
            selling: assetToSell,
            buying: assetToBuy,
            amount: fromAmount,
            price: sellPrice,
            offerId: 0,
          })
        )
        .addOperation(
          Operation.pathPaymentStrictSend({
            sendAsset: assetToSell,
            sendAmount: fromAmount,
            destination: address,
            destAsset: assetToBuy,
            destMin: (sellPrice - (sellPrice * slippage) / 100).toFixed(4),
          })
        )
        .setTimeout(30)
        .build();

      const { signedXDR } = await kit.sign({
        xdr: transaction.toXDR(),
        publicKey: address,
      });

      const _trans = TransactionBuilder.fromXDR(signedXDR, Networks.PUBLIC);

      const transactionResult = await server.submitTransaction(_trans);
      if (transactionResult) {
        return { hash: transactionResult?.hash };
      }
    } catch (error: any) {
      if (error.name === "NotFoundError") {
        throw new Error("Connected address Not Found! make sure it's funded.");
      }
      throw new Error(error.message);
    }
  };

  const fetchBalance = async () => {
    let balances;

    try {
      balances = {};
      const account = await server.loadAccount(address);

      for (let i = 0; i < account.balances.length; i++) {
        const balance = account.balances[i];

        if (balance.asset_type === "credit_alphanum4") {
          balances[balance.asset_code] = balance.balance;
        }
      }
    } catch (error) {
      balances = _map(tokenBalances, (val) => {
        return 0;
      });
    }

    setTokenBalances(balances);
  };

  const fetchBalanceFuture = async () => {
    let balances;

    if (_get(network, "token", []).length) {
      try {
        balances = {};

        const [stkn1, rtkn1, stkn2, rtkn2] = await tokenSwap.check_balances({
          offeror: address,
          acceptor: address,
          send_token: network.token[0].contract.address,
          recv_token: network.token[1].contract.address,
        });

        balances[network.token[0].sub] = calculateDecimalValue(
          network.sub,
          Number(stkn1.toString()),
          network.token[0].contract.decimals
        );
        balances[network.token[1].sub] = calculateDecimalValue(
          network.sub,
          Number(rtkn1.toString()),
          network.token[1].contract.decimals
        );

        setTokenBalances(balances);
      } catch (error) {
        console.log("err", error);
        balances = _map(tokenBalances, (val) => {
          return 0;
        });

        setTokenBalances(balances);
      }
    }
  };

  const getTokenBalanceFiat = () => {
    const gBal = {};
    const _tokenBalances = { ...tokenBalances };
    let total = 0;

    _forEach(_tokenBalances, (balance, coin) => {
      const bal =
        Number(balance || "0") *
        Number(
          _get(
            rates,
            `${coin.toUpperCase()}.${(currency.code || "").toUpperCase()}`,
            "0"
          )
        );

      total += bal;
      gBal[coin] = Number(bal.toFixed(2));
    });

    setTokensBalanceFiat(gBal);
    setTotalBalance(Number(total.toFixed(2)));
  };

  function executeTransaction(operation: SorobanClient.xdr.Operation): any {
    return new Promise(async (resolve, reject) => {
      try {
        await kit.setNetwork(WalletNetwork.FUTURENET);

        const _server = new SorobanClient.Server(
          "https://rpc-futurenet.stellar.org"
        );
        const sourceAcc = await _server.getAccount(address);

        const transaction0 = new SorobanClient.TransactionBuilder(sourceAcc, {
          fee: BASE_FEE,
          networkPassphrase: SorobanClient.Networks.FUTURENET,
        })
          .addOperation(operation)
          .setTimeout(30)
          .build();

        const transaction = await _server.prepareTransaction(
          transaction0,
          SorobanClient.Networks.FUTURENET
        );

        const { signedXDR } = await kit.sign({
          xdr: transaction.toXDR(),
          publicKey: address,
          network: WalletNetwork.FUTURENET,
        });

        const _trans = SorobanClient.TransactionBuilder.fromXDR(
          signedXDR,
          SorobanClient.Networks.FUTURENET
        );
        // const transaction = await _server.prepareTransaction(_trans);
        const response = await _server.sendTransaction(_trans);
        console.log("response1", response);
        let response2;

        if (response.status !== "PENDING") {
          console.log("Transaction status:", response.status);
          // console.log(JSON.stringify(response));

          if (response.status === "ERROR") {
            return response;
          }
        } else {
          do {
            // Wait a second
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // See if the transaction is complete
            response2 = await _server.getTransaction(response.hash);

            if (response2.status === "SUCCESS") {
              console.log(1);
              resolve({ hash: response.hash, ...response2 });
            }
          } while (
            response2.status !== "SUCCESS" &&
            response2.status !== "FAILED"
          );

          console.log("response2", response2);
          console.log("Transaction2 status:", response2.status);
          // console.log(JSON.stringify(response2));
          if (response2.status === "FAILED") {
            throw new Error("Failed");
          }
        }

        console.log("Sent! Transaction Hash:", response.hash);
      } catch (e: any) {
        console.log("ffff", e);
        reject(e);
      }
    });
  }

  const processAllowance = async (contractAddress: any, amount: any) => {
    try {
      await kit.setNetwork(WalletNetwork.FUTURENET);

      const _contract = new SorobanClient.Contract(contractAddress);

      const res = await executeTransaction(
        _contract.call(
          "approve",
          SorobanClient.xdr.ScVal.scvAddress(
            SorobanClient.Address.fromString(address).toScAddress()
          ),
          SorobanClient.xdr.ScVal.scvAddress(
            SorobanClient.Address.fromString(
              tokenSwap.CONTRACT_ID
            ).toScAddress()
          ),
          SorobanClient.xdr.ScVal.scvI128(
            new SorobanClient.xdr.Int128Parts({
              hi: new SorobanClient.xdr.Int64(Math.ceil(amount)),
              lo: new SorobanClient.xdr.Uint64("0"),
            })
          ),
          SorobanClient.xdr.ScVal.scvU32(2000000)
        )
      );

      console.log("fff", res);

      return { hash: res?.hash };
    } catch (error: any) {
      console.log("ffff", error);
      throw new Error(error);
    }
  };

  const makeOffer = async (sendData) => {
    await kit.setNetwork(WalletNetwork.FUTURENET);
    const res = await executeTransaction(
      contract.call(
        "create_offer",
        SorobanClient.xdr.ScVal.scvAddress(
          SorobanClient.xdr.ScAddress.scAddressTypeAccount(
            SorobanClient.Keypair.fromPublicKey(address).xdrPublicKey()
          )
        ),
        SorobanClient.xdr.ScVal.scvAddress(
          SorobanClient.Address.fromString(sendData.sId).toScAddress()
        ),
        SorobanClient.xdr.ScVal.scvAddress(
          SorobanClient.Address.fromString(sendData.rId).toScAddress()
        ),
        SorobanClient.xdr.ScVal.scvU32(/* ===Date.now() */ 1000),
        SorobanClient.xdr.ScVal.scvU64(
          new SorobanClient.xdr.Uint64(sendData.sAmt)
        ),
        SorobanClient.xdr.ScVal.scvU64(
          new SorobanClient.xdr.Uint64(sendData.rAmt)
        ),
        SorobanClient.xdr.ScVal.scvU64(
          new SorobanClient.xdr.Uint64(sendData.min)
        )
      )
    );

    if (res?.hash) {
      try {
        console.log("wait");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log("wait over");
        const offerCount = await tokenSwap.count_offers();
        const newOfferId = offerCount - 1;

        const errorCode = await tokenSwap.get_error();

        if (errorCode != 0 && errorCode != newOfferId) {
          const err = _get(OFFER_CREATE_ERRORS, errorCode, "");
          if (err !== "") {
            throw new Error(err);
          }
        }

        const tokens = _get(network, "token", []);
        const sContract = _find(tokens, ["idx", sendData.sId]);
        const rContract = _find(tokens, ["idx", sendData.rId]);

        const finalOfferData = {
          offerId: newOfferId,
          chainId: network.chainId,
          createdBy: address,
          sendToken: {
            decimals: sContract.contract.decimals,
            tokenAddress: sContract.contract.address,
            tokenName: sContract.name,
          },
          sendTokenId: sendData.sId,
          sendAmount: Number(
            calculateDecimalValue(network.sub, sendData.sAmt, 2)
          ),
          receiveToken: {
            decimals: rContract.contract.decimals,
            tokenAddress: rContract.contract.address,
            tokenName: rContract.name,
          },
          receiveTokenId: sendData.rId,
          receiveAmount: Number(
            calculateDecimalValue(network.sub, sendData.rAmt, 2)
          ),
          minReceiveAmount: Number(
            calculateDecimalValue(network.sub, sendData.min, 2)
          ),
          rate: Number((sendData.rAmt / sendData.sAmt).toFixed(4)),
          status: 0,
          txHash: res?.hash || "",
        };

        console.log("newOfferId", newOfferId);
        await createOffer(
          `${network.chainId}-${newOfferId}`.toString(),
          finalOfferData
        );

        return { hash: res?.hash };
      } catch (err: any) {
        console.error(err);
        throw new Error(err);
      }
    }
  };

  const acceptOffer = async (id, amount) => {
    await kit.setNetwork(WalletNetwork.FUTURENET);

    const contract = new SorobanClient.Contract(tokenSwap.CONTRACT_ID);

    const offer: any = await getOffer(network.chainId, Number(id));

    const res = await executeTransaction(
      contract.call(
        "accept_offer",
        SorobanClient.xdr.ScVal.scvAddress(
          SorobanClient.xdr.ScAddress.scAddressTypeAccount(
            SorobanClient.Keypair.fromPublicKey(address).xdrPublicKey()
          )
        ),
        SorobanClient.xdr.ScVal.scvU32(Number(id)),
        SorobanClient.xdr.ScVal.scvU64(
          new SorobanClient.xdr.Uint64(parseFloat(amount))
        )
      )
    );

    const errorCode = await tokenSwap.get_error();

    if (errorCode != 0) {
      const err = _get(OFFER_ACCEPT_ERRORS, errorCode, "");
      if (err !== "") {
        throw new Error(err);
      }
    }

    if (offer) {
      const amountD = calculateDecimalValue(
        network.sub,
        Number(amount),
        Number(offer?.receive?.decimals)
      );
      const newR = Number(
        Number(offer?.receiveAmount || "0") - Number(amountD)
      );
      // const newS = (newR / Number(offer.rate)).toFixed(4);
      const newM = newR < Number(offer.min) ? newR : offer.min;

      if (res?.hash) {
        await changeOffer(`${network.chainId}-${id}`.toString(), {
          receiveAmount: Number(newR),
          // sendAmount: Number(newS),
          min: Number(newM),
          status: newR <= 0 ? 1 : offer.status,
        });
      }
    }

    return { hash: res?.hash };
  };

  const updateOffer = async (id, amount, min) => {
    await kit.setNetwork(WalletNetwork.FUTURENET);

    const contract = new SorobanClient.Contract(tokenSwap.CONTRACT_ID);

    const offer: any = await getOffer(network.chainId, Number(id));

    const res = await executeTransaction(
      contract.call(
        "update_offer",
        SorobanClient.xdr.ScVal.scvAddress(
          SorobanClient.xdr.ScAddress.scAddressTypeAccount(
            SorobanClient.Keypair.fromPublicKey(address).xdrPublicKey()
          )
        ),
        SorobanClient.xdr.ScVal.scvU32(id),
        SorobanClient.xdr.ScVal.scvU64(new SorobanClient.xdr.Uint64(amount)),
        SorobanClient.xdr.ScVal.scvU64(new SorobanClient.xdr.Uint64(min))
      )
    );

    const errorCode = await tokenSwap.get_error();

    if (errorCode != 0) {
      const err = _get(OFFER_UPDATE_ERRORS, errorCode, "");
      if (err !== "") {
        throw new Error(err);
      }
    }

    const nRAmt = calculateDecimalValue(
      network.sub,
      Number(amount),
      Number(offer?.receive?.decimals)
    );

    const nMin = calculateDecimalValue(
      network.sub,
      Number(min),
      Number(offer?.receive?.decimals)
    );

    await changeOffer(`${network.chainId}-${id}`.toString(), {
      receiveAmount: Number(nRAmt),
      rate: Number((Number(nRAmt) / Number(offer.sendAmount)).toFixed(2)),
      min: Number(nMin),
    });

    return { hash: res?.hash };
  };

  const cancelOffer = async (id) => {
    await kit.setNetwork(WalletNetwork.FUTURENET);

    const contract = new SorobanClient.Contract(tokenSwap.CONTRACT_ID);
    const res = await executeTransaction(
      contract.call(
        "close_offer",
        SorobanClient.xdr.ScVal.scvAddress(
          SorobanClient.xdr.ScAddress.scAddressTypeAccount(
            SorobanClient.Keypair.fromPublicKey(address).xdrPublicKey()
          )
        ),
        SorobanClient.xdr.ScVal.scvU32(Number(id))
      )
    );

    const errorCode = await tokenSwap.get_error();

    if (errorCode != 0) {
      const err = _get(OFFER_CLOSE_ERRORS, errorCode, "");
      if (err !== "") {
        throw new Error(err);
      }
    }

    if (res?.hash) {
      await changeOffer(`${network.chainId}-${id}`.toString(), {
        status: 2,
      });
    }

    return { hash: res?.hash };
  };

  useEffect(() => {
    let _publicKey = "";

    const syncWallet = async () => {
      if (selectedWallet === WalletType.WALLET_CONNECT) {
        try {
          await kit.startWalletConnect({
            name: "WAVY",
            description: "WAVY DAPP",
            url: "https://wavyxyz.netlify.app/",
            icons: ["URL_OF_ICON"],
            projectId: import.meta.env.VITE_WC_PROJECT_ID,
          });

          const sessions = await kit.getSessions();
          if (sessions.length) {
            await kit.setSession(sessions[0]?.id);
          }

          setIsConnecting(false);
        } catch (error) {}
        _publicKey = await kit?.getWalletConnectPublicKey();
      } else {
        _publicKey = await kit.getPublicKey();
        setIsConnecting(false);
      }
      setAddress(_publicKey);
      setIsConnected(true);
    };

    if (
      selectedWallet &&
      isConnecting === false &&
      (network?.sub).toLowerCase() === "stellar"
    ) {
      setIsConnecting(true);
      setTimeout(() => {
        syncWallet();
      }, 1000);
    }
  }, [selectedWallet, network?.sub, network?.chainId]);

  useEffect(() => {
    if (address) {
      if (network.chainId === 169) {
        fetchBalance();
      } else {
        fetchBalanceFuture();
      }
    }
  }, [address, server, network]);

  useEffect(() => {
    getTokenBalanceFiat();
  }, [tokenBalances, rates, currency]);

  useEffect(() => {
    setServer(
      new Server(
        network.chainId === 169
          ? "https://horizon.stellar.org"
          : "https://horizon-futurenet.stellar.org"
      )
    );

    setTimeout(() => {
      setIsConnected(false);
      setAddress("");
    }, 200);
  }, [network?.chainId]);

  useEffect(() => {
    if ((network?.sub || "").toLowerCase() === "Stellar".toLocaleLowerCase())
      getRates();

    // eslint-disable-next-line
  }, [network]);

  return {
    connect,
    isConnected,
    selectedAccount: address,
    totalBalance,
    tokensBalanceFiat,
    tokenBalances,
    fees,
    // getAllowance,
    processAllowance,
    makeOffer,
    // removeFromAllowList,
    // addToAllowList,
    acceptOffer,
    cancelOffer,
    updateOffer,
    // writeTransaction,
    quoteSwap,
    createSwap,
  };
}

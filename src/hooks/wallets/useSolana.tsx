import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { useAppDispatch, useAppSelector } from "hooks/useRedux";

import { useCallback, useEffect, useState } from "react";
import { changeConnect } from "redux/info";

import { web3 } from "@project-serum/anchor";

import _get from "lodash/get";
import _find from "lodash/find";
import _forEach from "lodash/forEach";
import { Connectivity } from "providers/Connectivity";
import { calculateDecimalValue } from "utils/common";
import axios from "axios";
import { fetchRates } from "utils/exchange";

export default function useSolana() {
  const network = useAppSelector((state) => state.network);
  const { currency } = useAppSelector((state) => state.info);

  const dispatch = useAppDispatch();

  const tokens = _get(network, "token", []);
  const { connection } = useConnection();

  const { publicKey, connected } = useWallet();
  const wallet = useWallet();

  const [tokenBalances, setTokenBalances] = useState<any>({});
  const [tokensBalanceFiat, setTokensBalanceFiat] = useState<any>({});
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [rates, setRates] = useState({});

  const getRates = useCallback(
    () => {
      fetchRates().then((res) => setRates(res));
    },

    // eslint-disable-next-line
    [network.sub]
  );

  const tranferOwnerShip = async (ownerAddress) => {
    const connectivity = new Connectivity(wallet, network.chainId);

    const hash = await connectivity.tranferOwnerShip(ownerAddress);

    return {
      hash,
    };
  };

  const fetchBalances = async () => {
    const connectivity = new Connectivity(wallet, network.chainId);
    const _balances = {};

    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      const _balance = await connectivity.getTokenBalance(
        token.contract.address,
        publicKey
      );
      const balance = calculateDecimalValue(
        network.sub,
        _balance,
        token.contract.decimals
      );
      _balances[token.name] = balance;
    }

    setTokenBalances({ ..._balances });
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

  const makeOffer = async (sendData) => {
    const connectivity = new Connectivity(wallet, network.chainId);

    const sContract = _find(tokens, ["idx", sendData.sId]);
    const rContract = _find(tokens, ["idx", sendData.rId]);

    const offeredToken = new PublicKey(_get(sContract.contract, "address", ""));
    const requestedToken = new PublicKey(
      _get(rContract.contract, "address", "")
    );

    const hash = await connectivity.createOffer(
      offeredToken,
      requestedToken,
      sendData.sAmt,
      sendData.rAmt,
      sendData.min
    );

    return { hash };
  };

  const updateOffer = async (id, amount, min) => {
    const connectivity = new Connectivity(wallet, network.chainId);

    const data = {
      offerId: id,
      newRequestedTokenAmount: amount,
      newMinRequestedTokenAmount: min,
    };

    const hash = await connectivity.editOffer(data);

    return {
      hash,
    };
  };

  const cancelOffer = async (id) => {
    const connectivity = new Connectivity(wallet, network.chainId);

    const hash = await connectivity.closeOffer(id);

    return { hash };
  };

  const acceptOffer = async (id, amount) => {
    const connectivity = new Connectivity(wallet, network.chainId);

    const hash = await connectivity.acceptOffer(id, amount);

    return { hash };
  };

  const addToAllowList = async (
    address,
    symbol = "",
    decimals = "",
    chainId = ""
  ) => {
    const connectivity = new Connectivity(wallet, network.chainId);

    const hash = await connectivity._allowToken(address);

    return { hash };
  };

  const removeFromAllowList = async (address, chainId = "") => {
    const connectivity = new Connectivity(wallet, network.chainId);

    const hash = await connectivity._disAllowToken(address);

    return { hash };
  };

  const callQuoteSwap = async (from, to, amount, slippage = 1) => {
    const fromDecimals = _get(
      _find(network.token, function (o) {
        return o.contract.address === from;
      }),
      "contract.decimals",
      18
    );

    const body = {
      inputMint: from,
      outputMint: to,
      amount: (amount * 10 ** fromDecimals).toString(),
      slippageBps: slippage.toString(),
    };

    const url =
      "https://quote-api.jup.ag/v4/quote?" + new URLSearchParams(body);

    const response = await axios.get(url, {
      withCredentials: false,
    });

    const responseData = response.data;

    if (response.status === 200) {
      return responseData.data;
    } else {
      throw new Error(responseData.message);
    }
  };

  const quoteSwap = async (from, to, amount, slippage = 1) => {
    try {
      const quoteRes = await callQuoteSwap(from, to, amount, slippage);

      const toDecimals = _get(
        _find(network.token, function (o) {
          return o.contract.address === to;
        }),
        "contract.decimals",
        18
      );

      return calculateDecimalValue(
        network.sub,
        _get(quoteRes, "0.outAmount", 0),
        toDecimals
      );
    } catch (error: any) {
      // return 0;
      throw new Error(error?.response?.data?.message || error?.message);
    }
  };

  const createSwap = async (from, to, fromAmount, slippage = 1) => {
    try {
      const quoteRes = await callQuoteSwap(from, to, fromAmount, slippage);

      const body = {
        route: quoteRes[0],
        userPublicKey: publicKey.toString(),
        wrapUnwrapSOL: false,
      };

      const response = await axios.post(
        "https://quote-api.jup.ag/v4/swap",
        body,
        {
          withCredentials: false,
        }
      );

      const responseData = response.data;

      if (response.status === 200) {
        const tx = responseData.swapTransaction;

        const transactionBuf = Buffer.from(tx, "base64");
        const transaction =
          web3.VersionedTransaction.deserialize(transactionBuf);

        // const blockHash = (await connection.getLatestBlockhash("finalized"))
        //   .blockhash;
        // transaction.message.recentBlockhash = blockHash;

        const hash = await wallet.sendTransaction(transaction, connection, {
          skipPreflight: true,
          maxRetries: 2,
        });

        return { hash, wait: connection.confirmTransaction(hash) };
      } else {
        throw new Error(responseData.message);
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (connection && connected === true) {
      dispatch(
        changeConnect({
          name: "solana",
        })
      );
    }

    // eslint-disable-next-line
  }, [connection, network, connected]);

  useEffect(() => {
    if (connected && network.sub === "Solana") {
      fetchBalances();
    }

    // eslint-disable-next-line
  }, [tokens, publicKey, connected, network]);

  useEffect(() => {
    getTokenBalanceFiat();

    // eslint-disable-next-line
  }, [tokenBalances, currency, rates]);

  useEffect(() => {
    if ((network?.sub || "").toLowerCase() === "solana") getRates();

    // eslint-disable-next-line
  }, [network]);

  return {
    isConnected: !!publicKey,
    selectedAccount: publicKey?.toString(),
    totalBalance,
    tokensBalanceFiat,
    tokenBalances,
    makeOffer,
    cancelOffer,
    updateOffer,
    acceptOffer,
    addToAllowList,
    removeFromAllowList,
    quoteSwap,
    quoteSwapAllowance: null,
    createSwap,
    tranferOwnerShip,
  };
}

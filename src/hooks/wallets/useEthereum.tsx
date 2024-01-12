import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useContractReads,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import {
  readContract,
  writeContract,
  waitForTransaction,
  prepareSendTransaction,
  sendTransaction,
} from "@wagmi/core";
import { changeConnect } from "redux/info";
import { ethers } from "ethers";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _forEach from "lodash/forEach";
import _isEqual from "lodash/isEqual";
import _find from "lodash/find";
import axios from "axios";

import { fetchRates } from "utils/exchange";
import { calculateDecimalValue } from "utils/common";
import { getContract } from "config/constants/contracts";

const supportedNetworks = {
  Ethereum: [1],
  Polygon: [137],
  Avalanche: [43114],
};

const ONE_INCH_API =
  import.meta.env.VITE_ETH_SWAP_ENDPOINT || "https://api.1inch.dev/swap/v5.2";

const DFC_NGNC_CONF = {
  ngncToken: "0xab9ad9089f23e6779a8727900709427719f753e1".toLowerCase(),
  quoteToken: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174".toLowerCase(),
  address: "0x575f1ed1e14ac1152bf2f1cdfb2c1865ca246f51".toLowerCase(),
  ABI: [
    {
      inputs: [{ internalType: "address", name: "_factory", type: "address" }],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "factory",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_quoteCurrency", type: "address" },
        { internalType: "address", name: "_origin", type: "address" },
        { internalType: "address", name: "_target", type: "address" },
        { internalType: "uint256", name: "_originAmount", type: "uint256" },
        { internalType: "uint256", name: "_minTargetAmount", type: "uint256" },
        { internalType: "uint256", name: "_deadline", type: "uint256" },
      ],
      name: "originSwap",
      outputs: [
        { internalType: "uint256", name: "targetAmount_", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_quoteCurrency", type: "address" },
        { internalType: "address", name: "_origin", type: "address" },
        { internalType: "address", name: "_target", type: "address" },
        { internalType: "uint256", name: "_originAmount", type: "uint256" },
      ],
      name: "viewOriginSwap",
      outputs: [
        { internalType: "uint256", name: "targetAmount_", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_quoteCurrency", type: "address" },
        { internalType: "address", name: "_origin", type: "address" },
        { internalType: "address", name: "_target", type: "address" },
        { internalType: "uint256", name: "_targetAmount", type: "uint256" },
      ],
      name: "viewTargetSwap",
      outputs: [
        { internalType: "uint256", name: "originAmount_", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};

export default function useEthereum() {
  const { chain } = useNetwork();
  const {
    switchNetwork,
    isLoading: chainSwitchPending,
    isError: chainIsError,
  } = useSwitchNetwork();

  const { currency } = useAppSelector((state) => state.info);
  const network = useAppSelector((state) => state.network);
  const dispatch = useAppDispatch();

  const tokens = _get(network, "token", []);

  const [tokenBalances, setTokenBalances] = useState<any>({});
  const [tokensBalanceFiat, setTokensBalanceFiat] = useState<any>({});
  const [totalBalance, setTotalBalance] = useState<any>(0);

  const [rates, setRates] = useState<any>({});

  const { address, isConnected, connector: activeConnector } = useAccount();

  const getContractList = () => {
    const _escrowContract = getContract(network.sub);

    return tokens
      .filter((t) => !!t?.contract?.address && t.isAllowed)
      .map((t) => ({
        address: t?.contract?.address || "",
        abi: _escrowContract.erc20Abi,
        functionName: "balanceOf",
        args: [address],
        chainId: network.chainId,
      }));
  };

  const [wagmiTokens, setWagmiTokens] = useState(getContractList());

  const {
    data: balanceData,
    isSuccess: balanceSuccess,
    isLoading: balanceIsLoading,
    refetch: balanceRefetch,
  } = useContractReads({
    contracts: wagmiTokens,
    enabled: true,
    cacheOnBlock: false,
  });

  const updateBalance = () => {
    const _tokens = { ...tokens };
    const _tokenBalances = {};
    const _tokenBalancesKeys = tokens.map((t) => t.name);

    (balanceData || []).forEach(function (row: any, index) {
      const balanceStr = row.result
        ? ethers.utils.formatUnits(
            row.result,
            _get(_tokens, `${index}.contract.decimals`, 18)
          )
        : 0;

      const balance = balanceStr === "" ? 0 : Number(balanceStr);

      _tokenBalances[_tokenBalancesKeys[index]] = balance;
    });

    setTokenBalances(_tokenBalances);
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

  const isNetworkIsSupported = (network) => {
    return Object.keys(supportedNetworks).includes(network);
  };

  const iShouldCare = () => {
    return (
      isConnected &&
      network.chainId !== chain?.id &&
      chainSwitchPending !== true &&
      isNetworkIsSupported(network.sub)
    );
  };

  const getAllowance = async (contractAddress, decimals = 6) => {
    const _escrowContract = getContract(network.sub);

    const data: any = await readContract({
      chainId: network.chainId,
      address: contractAddress,
      abi: _escrowContract.erc20Abi as any,
      functionName: "allowance",
      args: [address, _escrowContract.address] as never,
    });

    return ethers.utils.formatUnits(data, decimals);
  };

  const processAllowance = async (contractAddress: any, amount: any) => {
    const _escrowContract = getContract(network.sub);

    const { hash } = await writeContract({
      chainId: network.chainId as never,
      address: contractAddress as never,
      abi: _escrowContract.erc20Abi as never,
      functionName: "approve" as never,
      args: [_escrowContract.address, amount] as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const makeOffer = async (sendData) => {
    const _escrowContract = getContract(network.sub);

    const args = [
      sendData.sId,
      sendData.sAmt,
      sendData.rId,
      sendData.rAmt,
      sendData.min,
    ];

    const { hash } = await writeContract({
      chainId: network.chainId as never,
      address: _escrowContract.address as never,
      abi: _escrowContract.abi as never,
      functionName: "makeOffer" as never,
      args: args as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const removeFromAllowList = async (idx, chainId) => {
    const _escrowContract = getContract(network.sub);

    const { hash } = await writeContract({
      chainId: chainId as never,
      address: _escrowContract.address as never,
      abi: _escrowContract.abi as never,
      functionName: "removeFromAllowList" as never,
      args: [idx] as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const addToAllowList = async (address, symbol, decimals, chainId) => {
    const _escrowContract = getContract(network.sub);

    const isAllowed: any = await readContract({
      chainId: network.chainId,
      address: _escrowContract.address as any,
      abi: _escrowContract.abi as any,
      functionName: "isAllowed",
      args: [address] as never,
    });

    if (isAllowed === true) {
      throw Error("Token Exists Already");
    }

    const { hash } = await writeContract({
      chainId: chainId as never,
      address: _escrowContract.address as never,
      abi: _escrowContract.abi as never,
      functionName: "addToAllowList" as never,
      args: [symbol, address, decimals] as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const acceptOffer = async (id, amount) => {
    const args = [id, amount];
    const _escrowContract = getContract(network.sub);

    const { hash } = await writeContract({
      chainId: network.chainId as never,
      address: _escrowContract.address as never,
      abi: _escrowContract.abi as never,
      functionName: "acceptOffer" as never,
      args: args as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const updateOffer = async (id, amount, min) => {
    const _escrowContract = getContract(network.sub);
    const args = [id, amount, min];

    const { hash } = await writeContract({
      chainId: network.chainId as never,
      address: _escrowContract.address as never,
      abi: _escrowContract.abi as never,
      functionName: "updateOffer" as never,
      args: args as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const cancelOffer = async (id) => {
    const _escrowContract = getContract(network.sub);
    const args = [id];

    const { hash } = await writeContract({
      chainId: network.chainId as never,
      address: _escrowContract.address as never,
      abi: _escrowContract.abi as never,
      functionName: "cancelOffer" as never,
      args: args as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const getRates = useCallback(
    () => {
      fetchRates().then((res) => setRates(res));
    },

    // eslint-disable-next-line
    [network.sub]
  );

  const getNgncSwapQuote = async (from, to, fromAmount) => {
    try {
      const data: any = await readContract({
        chainId: network.chainId as never,
        address: DFC_NGNC_CONF.address as never,
        abi: DFC_NGNC_CONF.ABI as never,
        functionName: "viewOriginSwap" as never,
        args: [DFC_NGNC_CONF.quoteToken, from, to, fromAmount],
      });

      const val = ethers.utils.formatUnits(data, 6);

      return val;
    } catch (error) {
      throw new Error("Pair not available");
    }
  };

  const quoteSwap = async (from, to, fromAmount) => {
    if (
      Number(network.chainId) === 137 &&
      (from.toLocaleLowerCase() === DFC_NGNC_CONF.ngncToken ||
        to.toLocaleLowerCase() === DFC_NGNC_CONF.ngncToken)
    ) {
      const val = await getNgncSwapQuote(from, to, fromAmount);

      return val;
    } else {
      const body = {
        fromTokenAddress: from,
        toTokenAddress: to,
        amount: fromAmount.toString(),
      };

      const url =
        ONE_INCH_API +
        "/" +
        network.chainId +
        "/quote?" +
        new URLSearchParams(body);

      try {
        const response = await axios.get(url, {
          withCredentials: false,
        });

        const responseData = response.data;

        if (response.status === 200) {
          const toDecimals = _get(
            _find(network.token, function (o) {
              return o.contract.address === to;
            }),
            "contract.decimals",
            18
          );

          return calculateDecimalValue(
            network.sub,
            response.data.toAmount,
            toDecimals
          );
        } else {
          throw new Error(responseData);
        }
      } catch (error: any) {
        console.log("eee", error);
        return 0;
      }
    }
  };

  const quoteSwapAllowance = async (tokenAddress, amount, to = null) => {
    try {
      if (
        Number(network.chainId) === 137 &&
        (tokenAddress.toLocaleLowerCase() === DFC_NGNC_CONF.ngncToken ||
          to.toLocaleLowerCase() === DFC_NGNC_CONF.ngncToken)
      ) {
        const _escrowContract = getContract(network.sub);

        const { hash } = await writeContract({
          chainId: network.chainId as never,
          address: tokenAddress as never,
          abi: _escrowContract.erc20Abi as never,
          functionName: "approve" as never,
          args: [DFC_NGNC_CONF.address, amount] as never,
        });

        return {
          hash,
          wait: waitForTransaction({
            chainId: network.chainId,
            hash,
            confirmations: 3,
          }),
        };
      } else {
        const url =
          ONE_INCH_API +
          "/" +
          network.chainId +
          "/approve/transaction?" +
          new URLSearchParams({
            tokenAddress,
            amount,
          });

        const response = await axios.get(url, {
          withCredentials: false,
        });

        const responseData = response.data;

        if (response.status === 200) {
          const tx = response.data;

          return await writeTransaction({
            to: tx.to,
            data: tx.data,
          });
        } else {
          throw new Error(responseData);
        }
      }
    } catch (error: any) {
      throw new Error(
        _get(
          error,
          "response.data.description",
          error?.shortMessage || error?.message
        )
      );
    }
  };

  const createNgncSwap = async (from, to, fromAmount, slippage = 1) => {
    const deadline = new Date().setDate(new Date().getDate() + 1);

    const { hash } = await writeContract({
      chainId: network.chainId as never,
      address: DFC_NGNC_CONF.address as never,
      abi: DFC_NGNC_CONF.ABI as never,
      functionName: "originSwap" as never,
      args: [
        DFC_NGNC_CONF.quoteToken,
        from,
        to,
        fromAmount,
        0,
        deadline,
      ] as never,
    });

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  const createSwap = async (from, to, fromAmount, slippage = 1) => {
    if (
      Number(network.chainId) === 137 &&
      (from.toLocaleLowerCase() === DFC_NGNC_CONF.ngncToken ||
        to.toLocaleLowerCase() === DFC_NGNC_CONF.ngncToken)
    ) {
      const dfxRes = await createNgncSwap(from, to, fromAmount, (slippage = 1));

      return dfxRes;
    } else {
      const body = {
        fromAddress: address,
        fromTokenAddress: from,
        toTokenAddress: to,
        amount: fromAmount.toString(),
        slippage: slippage.toString(),
      };

      const url =
        ONE_INCH_API +
        "/" +
        network.chainId +
        "/swap?" +
        new URLSearchParams(body);

      try {
        const response = await axios.get(url, {
          withCredentials: false,
        });

        const responseData = response.data;

        if (response.status === 200) {
          const tx = responseData.tx;

          return await writeTransaction({
            to: tx.to,
            data: tx.data,
          });
        } else {
          throw new Error(responseData);
        }
      } catch (error: any) {
        throw new Error(
          _get(error, "response.data.description", error?.message)
        );
      }
    }
  };

  const writeTransaction = async (txObj) => {
    const request = await prepareSendTransaction(txObj);
    const { hash } = await sendTransaction(request);

    return {
      hash,
      wait: waitForTransaction({
        chainId: network.chainId,
        hash,
        confirmations: 3,
      }),
    };
  };

  useEffect(() => {
    if (!_isEmpty(rates)) {
      getTokenBalanceFiat();
    }

    // eslint-disable-next-line
  }, [tokenBalances, rates, currency]);

  useEffect(() => {
    if (activeConnector && _get(chain, "unsupported", true) === false) {
      dispatch(
        changeConnect({
          name: activeConnector.name,
        })
      );
    }

    // eslint-disable-next-line
  }, [activeConnector, network, chain, chainSwitchPending]);

  useEffect(() => {
    if (
      !_isEmpty(rates) &&
      !_isEmpty(tokens) &&
      network.chainId === chain?.id &&
      !balanceIsLoading &&
      balanceSuccess
    ) {
      balanceRefetch();
    }

    // eslint-disable-next-line
  }, [
    rates,
    wagmiTokens,
    balanceIsLoading,
    balanceSuccess,
    chain,
    network,
    tokens,
    address,
  ]);

  useEffect(() => {
    updateBalance();
    // eslint-disable-next-line
  }, [balanceData]);

  useEffect(() => {
    if (iShouldCare() && !chainIsError) {
      switchNetwork?.(network.chainId);
    }

    // eslint-disable-next-line
  }, [network, chainSwitchPending, chain]);

  useEffect(() => {
    if (address) {
      const _tokens = getContractList();

      if (!_isEqual(_tokens, tokens)) {
        setWagmiTokens(getContractList());
      }
    }

    // eslint-disable-next-line
  }, [address, tokens]);

  useEffect(() => {
    if (
      chainSwitchPending === false &&
      _get(chain, "unsupported", true) === false
    ) {
      setWagmiTokens(getContractList());
    }

    // eslint-disable-next-line
  }, [chain, chainSwitchPending, isConnected, network]);

  useEffect(() => {
    if (isNetworkIsSupported(network.sub)) getRates();

    // eslint-disable-next-line
  }, [network]);

  return {
    isConnected,
    selectedAccount: address,
    totalBalance,
    tokensBalanceFiat,
    tokenBalances,
    getAllowance,
    processAllowance,
    makeOffer,
    removeFromAllowList,
    addToAllowList,
    acceptOffer,
    cancelOffer,
    updateOffer,
    writeTransaction,
    quoteSwap,
    quoteSwapAllowance,
    createSwap,
  };
}

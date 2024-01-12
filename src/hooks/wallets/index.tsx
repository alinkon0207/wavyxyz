import { useEffect, useState } from "react";
import useEthereum from "./useEthereum";
import { useAppSelector } from "hooks/useRedux";
import useSolana from "./useSolana";
import useStellar from "./useStellar";

export default function useWallet() {
  const { connect } = useAppSelector((state) => state.info);
  const network = useAppSelector((state) => state.network);
  const { currency } = useAppSelector((state) => state.info);

  const initState = {
    isConnected: false,
    selectedAccount: "",
    tokensBalanceFiat: {},
    tokenBalances: {},
    totalBalance: 0,
    getAllowance: null,
    processAllowance: null,
    makeOffer: null,
    removeFromAllowList: null,
    addToAllowList: null,
    acceptOffer: null,
    cancelOffer: null,
    updateOffer: null,
    writeTransaction: null,
    quoteSwap: null,
    quoteSwapAllowance: null,
    createSwap: null,
  };

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [tokensBalanceFiat, setTokensBalanceFiat] = useState<any>({});
  const [tokenBalances, setTokenBalances] = useState<any>({});
  const [totalBalance, setTotalBalance] = useState<any>(0);
  const [fees, setFees] = useState(0);
  const [getAllowance, setGetAllowance] = useState<any>();
  const [processAllowance, setProcessAllowance] = useState<any>();
  const [makeOffer, setMakeOffer] = useState<any>();
  const [removeFromAllowList, setRemoveFromAllowList] = useState<any>();
  const [addToAllowList, setAddToAllowList] = useState<any>();
  const [acceptOffer, setAcceptOffer] = useState<any>();
  const [cancelOffer, setCancelOffer] = useState<any>();
  const [updateOffer, setUpdateOffer] = useState<any>();

  const [quoteSwap, setQuoteSwap] = useState<any>();
  const [quoteSwapAllowance, setQuoteSwapAllowance] = useState<any>();
  const [createSwap, setCreateSwap] = useState<any>();

  const [writeTransaction, setWriteTransaction] = useState<any>();

  const [tranferOwnerShip, setTranferOwnerShip] = useState<any>();

  const setInitState = () => {
    setIsConnected(initState.isConnected);
    setSelectedAccount(initState.selectedAccount);
    setTokensBalanceFiat(initState.tokensBalanceFiat);
    setTokenBalances(initState.tokenBalances);
    setTotalBalance(initState.totalBalance);
    setGetAllowance(initState.getAllowance);
    setProcessAllowance(initState.processAllowance);
    setMakeOffer(initState.makeOffer);
    setRemoveFromAllowList(initState.removeFromAllowList);
    setAddToAllowList(initState.addToAllowList);
    setAcceptOffer(initState.acceptOffer);
    setCancelOffer(initState.cancelOffer);
    setUpdateOffer(initState.updateOffer);
    setWriteTransaction(initState.writeTransaction);
    setQuoteSwap(initState.writeTransaction);
    setQuoteSwapAllowance(initState.writeTransaction);
    setCreateSwap(initState.writeTransaction);
  };

  const {
    isConnected: ethIsConnected,
    totalBalance: ethTotalBalance,
    tokensBalanceFiat: ethTokensBalanceFiat,
    tokenBalances: ethTokenBalances,
    getAllowance: ethGetAllowance,
    processAllowance: ethProcessAllowance,
    makeOffer: ethMakeOffer,
    removeFromAllowList: ethRemoveFromAllowList,
    addToAllowList: ethAddToAllowList,
    selectedAccount: ethSelectedAccount,
    acceptOffer: ethAcceptOffer,
    cancelOffer: ethCancelOffer,
    updateOffer: ethUpdateOffer,
    writeTransaction: ethWriteTransaction,
    quoteSwap: ethQuoteSwap,
    quoteSwapAllowance: ethQuoteSwapAllowance,
    createSwap: ethCreateSwap,
  } = useEthereum();

  const {
    isConnected: solanaIsConnected,
    totalBalance: solanaTotalBalance,
    tokensBalanceFiat: solanaTokensBalanceFiat,
    tokenBalances: solanaTokenBalances,
    selectedAccount: solanaSelectedAccount,
    makeOffer: solanaMakeOffer,
    cancelOffer: solanaCancelOffer,
    updateOffer: solanaUpdateOffer,
    acceptOffer: solanaAcceptOffer,
    addToAllowList: solanaAddToAllowList,
    removeFromAllowList: solanaRemoveFromAllowList,
    createSwap: solanaCreateSwap,
    quoteSwapAllowance: solanaQuoteSwapAllowance,
    quoteSwap: solanaQuoteSwap,
    tranferOwnerShip: solanaTranferOwnerShip,
  } = useSolana();

  const {
    isConnected: stellerIsConnected,
    selectedAccount: stellerSelectedAccount,
    totalBalance: stellerTotalBalance,
    tokensBalanceFiat: stellerTokensBalanceFiat,
    tokenBalances: stellerTokenBalances,
    fees: stellerFees,
    quoteSwap: stellerQuoteSwap,
    createSwap: stellerCreateSwap,
    makeOffer: stellerMakeOffer,
    acceptOffer: stellerAcceptOffer,
    cancelOffer: stellerCancelOffer,
    updateOffer: stellerUpdateOffer,
    processAllowance: stellerProcessAllowance,
  } = useStellar();

  useEffect(() => {
    if (["Polygon", "Avalanche", "Ethereum"].indexOf(network?.sub) !== -1) {
      setIsConnected(ethIsConnected);
      setTokensBalanceFiat(ethTokensBalanceFiat);
      setTotalBalance(ethTotalBalance);
      setTokenBalances(ethTokenBalances);
      setSelectedAccount(ethSelectedAccount);

      setGetAllowance(() => {
        return ethGetAllowance;
      });

      setProcessAllowance(() => {
        return ethProcessAllowance;
      });

      setMakeOffer(() => {
        return ethMakeOffer;
      });

      setRemoveFromAllowList(() => {
        return ethRemoveFromAllowList;
      });

      setAddToAllowList(() => {
        return ethAddToAllowList;
      });

      setAcceptOffer(() => {
        return ethAcceptOffer;
      });

      setCancelOffer(() => {
        return ethCancelOffer;
      });

      setUpdateOffer(() => {
        return ethUpdateOffer;
      });

      setWriteTransaction(() => {
        return ethWriteTransaction;
      });

      setQuoteSwap(() => {
        return ethQuoteSwap;
      });

      setQuoteSwapAllowance(() => {
        return ethQuoteSwapAllowance;
      });

      setCreateSwap(() => {
        return ethCreateSwap;
      });
    } else if (network.sub === "Solana") {
      setIsConnected(solanaIsConnected);
      setSelectedAccount(solanaSelectedAccount);
      setTokensBalanceFiat(solanaTokensBalanceFiat);
      setTotalBalance(solanaTotalBalance);
      setTokenBalances(solanaTokenBalances);

      setTranferOwnerShip(() => {
        return solanaTranferOwnerShip;
      });

      setMakeOffer(() => {
        return solanaMakeOffer;
      });

      setCancelOffer(() => {
        return solanaCancelOffer;
      });

      setUpdateOffer(() => {
        return solanaUpdateOffer;
      });

      setAcceptOffer(() => {
        return solanaAcceptOffer;
      });

      setRemoveFromAllowList(() => {
        return solanaRemoveFromAllowList;
      });

      setAddToAllowList(() => {
        return solanaAddToAllowList;
      });

      setWriteTransaction(() => {
        return null;
      });

      setQuoteSwap(() => {
        return solanaQuoteSwap;
      });

      setQuoteSwapAllowance(() => {
        return solanaQuoteSwapAllowance;
      });

      setCreateSwap(() => {
        return solanaCreateSwap;
      });
    } else if (network.sub === "Stellar") {
      setIsConnected(stellerIsConnected);
      setSelectedAccount(stellerSelectedAccount);
      setTokensBalanceFiat(stellerTokensBalanceFiat);
      setTotalBalance(stellerTotalBalance);
      setTokenBalances(stellerTokenBalances);
      setFees(stellerFees);

      setQuoteSwap(() => {
        return stellerQuoteSwap;
      });

      setCreateSwap(() => {
        return stellerCreateSwap;
      });

      setMakeOffer(() => {
        return stellerMakeOffer;
      });

      setAcceptOffer(() => {
        return stellerAcceptOffer;
      });

      setCancelOffer(() => {
        return stellerCancelOffer;
      });

      setUpdateOffer(() => {
        return stellerUpdateOffer;
      });

      setProcessAllowance(() => {
        return stellerProcessAllowance;
      });
    } else {
      setInitState();
    }

    // eslint-disable-next-line
  }, [
    connect,
    network,
    ethTotalBalance,
    currency,
    solanaTotalBalance,
    stellerTotalBalance,
    ethIsConnected,
    solanaIsConnected,
    stellerIsConnected,
  ]);

  return {
    isConnected,
    selectedAccount,
    tokensBalanceFiat,
    totalBalance,
    tokenBalances,
    fees,
    getAllowance,
    processAllowance,
    makeOffer,
    removeFromAllowList,
    addToAllowList,
    acceptOffer,
    cancelOffer,
    updateOffer,
    quoteSwap,
    createSwap,
    quoteSwapAllowance,
    writeTransaction,
    tranferOwnerShip,
  };
}

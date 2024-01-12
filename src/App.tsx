import { BrowserRouter } from "react-router-dom";

import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  avalanche,
  avalancheFuji,
  sepolia,
  mainnet,
  polygon,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import Routes from "./routes";
import { fetchTokensByChainID } from "redux/network";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { useEffect } from "react";
import SolanaWalletContextProvider from "contexts/SolanaWalletContextProvider";

import "@solana/wallet-adapter-react-ui/styles.css";

const chains = [
  mainnet,
  // polygonMumbai,
  polygon,
  // sepolia,
  avalanche,
  // avalancheFuji,
];
const projectId = import.meta.env.VITE_WC_PROJECT_ID;
const RPC_CONFIG = {
  1: import.meta.env.VITE_ETH_MAINNET_RPC,
  43114: import.meta.env.VITE_CCHAIN_MAINNET_RPC,
  137: import.meta.env.VITE_MATIC_MAINNET_RPC,
};

const { publicClient } = configureChains(chains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: RPC_CONFIG[chain.id],
    }),
  }),
  publicProvider(),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  const dispatch = useAppDispatch();

  const network = useAppSelector((state) => state.network);

  useEffect(() => {
    dispatch(fetchTokensByChainID(network.chainId || 0));
  }, [network.chainId, dispatch]);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <SolanaWalletContextProvider>
          <BrowserRouter basename="">
            <Routes />
          </BrowserRouter>
        </SolanaWalletContextProvider>
      </WagmiConfig>

      <Web3Modal
        themeVariables={{
          "--w3m-font-family": "CoinbaseDisplay",
          "--w3m-accent-color": "#2e2d4e",
          "--w3m-background-color": "#2e2d4e",
          "--w3m-button-border-radius": "0.5rem",
          "--w3m-secondary-button-border-radius": "0.5rem",
          "--w3m-text-big-bold-line-height": "1.5rem",
          "--w3m-text-big-bold-size": "1rem",
        }}
        themeMode="dark"
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;

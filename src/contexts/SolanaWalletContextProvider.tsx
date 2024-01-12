import { useMemo, useCallback, FC, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  WalletConnectWalletAdapter,
  ExodusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useAppSelector } from "hooks/useRedux";

const SolanaWalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const selNetwork = useAppSelector((state) => state.network);

  const network =
    selNetwork.chainId === 101
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;
  const _endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY;
  const endpoint =
    selNetwork.chainId === 101 && ALCHEMY_KEY
      ? `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
      : _endpoint;

  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({ network: network, options: {} }),
      new PhantomWalletAdapter(),
      new ExodusWalletAdapter(),
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  const onError = useCallback((error: any) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletContextProvider;

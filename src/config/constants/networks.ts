// network icons
import stellarIcon from "assets/img/network/stellar.svg";
import polygonIcon from "assets/img/network/polygon.svg";
import avalancheIcon from "assets/img/network/avalanche.svg";
import ethereumIcon from "assets/img/network/ethereum.svg";
import solanaIcon from "assets/img/network/solana.svg";
import tronIcon from "assets/img/network/tron.svg";

export const NETWORK = [
  {
    name: "Ethereum",
    sub: "Ethereum",
    chainId: 1,
    explorerUrl: "https://etherscan.io",
    icon: ethereumIcon,
    token: [],
    wallet: [],
    offers: [],
  },
  {
    name: "Polygon",
    sub: "Polygon",
    chainId: 137,
    icon: polygonIcon,
    explorerUrl: "https://polygonscan.com",
    token: [],
    wallet: [],
    offers: [],
  },
  {
    name: "Avalanche",
    sub: "Avalanche",
    chainId: 43114,
    icon: avalancheIcon,
    explorerUrl: "https://snowtrace.io",
    token: [],
    wallet: [],
    offers: [],
  },
  {
    name: "Stellar Mainnet",
    sub: "Stellar",
    chainId: 169,
    icon: stellarIcon,
    explorerUrl: "https://stellarchain.io",
    token: [],
    wallet: [],
  },
  {
    name: "Stellar Futurenet",
    sub: "Stellar",
    chainId: 2007,
    icon: stellarIcon,
    explorerUrl: "https://futurenet.stellarchain.io",
    token: [],
    wallet: [],
  },
  {
    name: "Solana Mainnet",
    sub: "Solana",
    chainId: 101,
    explorerUrl: "https://explorer.solana.com",
    icon: solanaIcon,
    token: [],
    wallet: [],
    offers: [],
  },
  // {
  //   name: "Ethereum Sepolia",
  //   sub: "Ethereum",
  //   chainId: 11155111,
  //   explorerUrl: "https://sepolia.etherscan.io/tx/",
  //   icon: ethereumIcon,
  //   token: [],
  //   wallet: [],
  //   offers: [],
  // },
  // {
  //   name: "Polygon Mumbai",
  //   sub: "Polygon",
  //   chainId: 80001,
  //   icon: polygonIcon,
  //   explorerUrl: "https://mumbai.polygonscan.com",
  //   token: [],
  //   wallet: [],
  //   offers: [],
  // },
  // {
  //   name: "Avalanche Testnet",
  //   sub: "Avalanche",
  //   chainId: 43113,
  //   icon: avalancheIcon,
  //   explorerUrl: "https://testnet.snowtrace.io",
  //   token: [],
  //   wallet: [],
  //   offers: [],
  // },
  // {
  //   name: "Solana Devnet",
  //   sub: "Solana",
  //   chainId: 102,
  //   explorerUrl: "https://explorer.solana.com",
  //   icon: solanaIcon,
  //   token: [],
  //   wallet: [],
  //   offers: [],
  // },

  // {
  //   name: "Tron Mainnet",
  //   sub: "Tron",
  //   icon: tronIcon,
  //   token: [],
  //   wallet: [
  //     {
  //       name: "TronLink",
  //       icon: tronwalletIcon,
  //     },
  //     {
  //       name: "walletConnect",
  //       icon: walletconnectIcon,
  //     },
  //   ],
  //   offers: [
  //     {
  //       send: {
  //         name: "USDC",
  //         icon: usdcIcon,
  //       },
  //       receive: {
  //         name: "TCNH",
  //         icon: tcnhIcon,
  //       },
  //       rate: "1 USDC = 5.48 TCNH",
  //       available: "2500 USDC",
  //       limit: "500 - 2000 TCNH",
  //       status: "active",
  //     },
  //     {
  //       send: {
  //         name: "USDT",
  //         icon: usdtIcon,
  //       },
  //       receive: {
  //         name: "EURS",
  //         icon: eursIcon,
  //       },
  //       rate: "1 USDT = 14.35 EURS",
  //       available: "2500 USDT",
  //       limit: "10 - 500 EURS",
  //       status: "accpted",
  //     },
  //   ],
  // },
];

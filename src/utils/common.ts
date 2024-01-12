import { ethers } from "ethers";

export const sleep = async (time) => {
  return await new Promise((resolve) => setTimeout(resolve, time)); // 3 sec
};

export const calculateNonDecimalValue = (
  network: string,
  value: number,
  decimal: number
) => {
  if (network.toLowerCase() === "solana") {
    return value;
  } else if (network.toLocaleLowerCase() === "stellar") {
    return value * 10 ** decimal;
  } else {
    return ethers.utils.parseUnits(value.toString(), decimal);
  }
};

export const calculateDecimalValue = (
  network: string,
  value: number,
  decimal: number
) => {
  if (["solana", "stellar"].indexOf(network.toLowerCase()) >= 0) {
    return value / 10 ** decimal;
  } else {
    return ethers.utils.formatUnits(value.toString(), decimal);
  }
};

export const getTransactionUrl = (chainId: any, url: string, txID: string) => {
  if (Number(chainId) === 102) {
    return `${url}/tx/${txID}?cluster=devnet`;
  } else if (Number(chainId) === 2007 || Number(chainId) === 169) {
    return `${url}/transactions/${txID}`;
  } else {
    return `${url}/tx/${txID}`;
  }
};

export const getShortAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// export const Number.prototype.round = function(places) {
//   return +(Math.round(this + "e+" + places)  + "e-" + places);
// }

const decimalPlaces = import.meta.env.VITE_AMOUNT_DECIMALS || 4;

export const formatNumber = (
  num: number | string,
  places: number = Number(decimalPlaces)
): number => {
  const multiplier = Math.pow(10, places);

  return Math.round(Number(num) * multiplier) / multiplier;
};

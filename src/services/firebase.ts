import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConnection } from "config/firebase";
import { icons } from "config/constants/token";

export async function getTokensByChain(chainId) {
  const tokenQuery = query(
    collection(firebaseConnection, "tokens"),
    where("chainId", "==", chainId)
  );

  const tokenSnapshot = await getDocs(tokenQuery);

  return tokenSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      name: data.name,
      icon: icons[data.name],
      sub: data.sub,
      isAllowed: data.isAllowed,
      idx: data.tokenId,
      contract: {
        address: data.address,
        decimals: data.decimals,
      },
    };
  });
}

export async function getTokens() {
  const tokenSnapshots = await getDocs(
    collection(firebaseConnection, "tokens")
  );

  const tokens = {};

  tokenSnapshots.forEach((tokenS) => {
    const token = tokenS.data();
    token.icon = icons[token.name];

    if (typeof tokens[token.chainId] !== "object") {
      tokens[token.chainId] = [];
    }

    tokens[token.chainId].push(token);
  });

  return tokens;
}

export async function getNetworks() {
  const networkSnapshots = await getDocs(
    collection(firebaseConnection, "networks")
  );

  const tokens = await getTokens();

  const networks = [];

  networkSnapshots.docs.forEach((networkS) => {
    const network = networkS.data();

    networks.push({
      ...network,
      token: tokens[network.chainId] || [],
    });
  });

  return networks;
}

export async function getOffers(
  chainId = 0,
  address = "",
  sendTokenId,
  receiveTokenId
) {
  const offersQuery = query(
    collection(firebaseConnection, "offers"),
    where("createdBy", "!=", address),
    where("chainId", "==", chainId),
    where("status", "==", 0),
    where("sendTokenId", "==", sendTokenId),
    where("receiveTokenId", "==", receiveTokenId),
    orderBy("createdBy"),
    orderBy("offerId", "desc")
  );

  const offersSnapshot = await getDocs(offersQuery);

  return offersSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      createdBy: data.createdBy,
      offerId: data.offerId,
      sendAmount: data.sendAmount,
      receiveAmount: data.receiveAmount,
      send: {
        name: data.sendToken.tokenName,
        address: data.sendToken.tokenAddress,
        decimals: data.sendToken.decimals,
        icon: icons[data.sendToken.tokenName],
      },
      receive: {
        name: data.receiveToken.tokenName,
        address: data.receiveToken.tokenAddress,
        decimals: data.receiveToken.decimals,
        icon: icons[data.receiveToken.tokenName],
      },
      rate: data.rate,
      min: data.minReceiveAmount,
      status: data.status,
    };
  });
}

export async function myOffers(chainId = 0, from = "") {
  const offersQuery = query(
    collection(firebaseConnection, "offers"),
    where("chainId", "==", chainId),
    where("createdBy", "==", from),
    orderBy("status"),
    orderBy("offerId", "desc")
  );

  const offersSnapshot = await getDocs(offersQuery);

  return offersSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      offerId: data.offerId,
      createdBy: data.createdBy,
      sendAmount: data.sendAmount,
      receiveAmount: data.receiveAmount,
      send: {
        name: data.sendToken.tokenName,
        address: data.sendToken.tokenAddress,
        decimals: data.sendToken.decimals,
        icon: icons[(data.sendToken.tokenName || "").toUpperCase()],
      },
      receive: {
        name: data.receiveToken.tokenName,
        address: data.receiveToken.tokenAddress,
        decimals: data.receiveToken.decimals,
        icon: icons[(data.receiveToken.tokenName || "").toUpperCase()],
      },
      rate: data.rate,
      min: data.minReceiveAmount,
      status: data.status,
    };
  });
}

export async function getOffer(chainId, id) {
  const offersQuery = query(
    collection(firebaseConnection, "offers"),
    where("chainId", "==", chainId),
    where("offerId", "==", id)
  );

  const offersSnapshot = await getDocs(offersQuery);

  const rows = offersSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      offerId: data.offerId,
      createdBy: data.createdBy,
      sendAmount: data.sendAmount,
      receiveAmount: data.receiveAmount,
      send: {
        name: data.sendToken.tokenName,
        address: data.sendToken.tokenAddress,
        decimals: data.sendToken.decimals,
        icon: icons[data.sendToken.tokenName],
      },
      receive: {
        name: data.receiveToken.tokenName,
        address: data.receiveToken.tokenAddress,
        decimals: data.receiveToken.decimals,
        icon: icons[data.receiveToken.tokenName],
      },
      rate: data.rate,
      min: data.minReceiveAmount,
      status: data.status,
    };
  });

  return rows[0] || {};
}

export async function removeToken(id) {
  await deleteDoc(doc(firebaseConnection, "tokens", id.toString()));
}

export async function createOffer(id, data) {
  await setDoc(doc(firebaseConnection, "offers", id.toString()), {
    offerId: data.offerId,
    chainId: data.chainId,
    createdBy: data.createdBy,
    sendToken: data.sendToken,
    sendTokenId: data.sendTokenId,
    sendAmount: data.sendAmount,
    receiveToken: data.receiveToken,
    receiveTokenId: data.receiveTokenId,
    receiveAmount: data.receiveAmount,
    minReceiveAmount: data.minReceiveAmount,
    rate: data.rate,
    txHash: data.txHash,
    status: data.status,
  });

  return true;
}

export async function changeOffer(id, data) {
  try {
    await updateDoc(doc(firebaseConnection, "offers", id.toString()), data);
  } catch (error) {}

  return true;
}

export async function addToken(
  chainId,
  tokenId,
  tokenName,
  tokenAddress,
  decimals
) {
  try {
    const data = {
      address: tokenAddress,
      chainId: chainId,
      decimals: decimals,
      icon: `assets/img/coin/${tokenName.toLowerCase()}.svg`,
      isAllowed: true,
      name: tokenName,
      sub: tokenName,
      tokenId: tokenId,
    };
    
    await setDoc(doc(firebaseConnection, "tokens", `${chainId}-${tokenId}`), data);
  } catch (error) {
    console.log("error", error);
  }
}

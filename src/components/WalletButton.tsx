import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import React, { useState } from "react";
import MobileList from "./MobileList";
import { changeConnect } from "redux/info";
import MenuList from "./MenuList";
import { Web3Button } from "@web3modal/react";
import useConfig from "hooks/useConfig";
import InfoList from "./InfoList";
import { useNavigate } from "react-router-dom";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useStellar from "hooks/wallets/useStellar";
import { getShortAddress } from "utils/common";

export default function WalletButton({ showMobileInfo, setCopied }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isMobile } = useConfig();

  const { connect } = useAppSelector((state) => state.info);
  const network = useAppSelector((state) => state.network);

  const { connect: connectSteller, selectedAccount
   } = useStellar();

  // TEMP
  const [walletAnchor, setWalletAnchor] = useState(false);
  const walletHandle = () => {
    setWalletAnchor(true);
  };
  const walletClose = () => {
    setWalletAnchor(false);
  };
  const setWallet = (i: number) => {
    dispatch(changeConnect(network.wallet[i]));
    walletClose();
  };

  const [infoAnchor, setInfoAnchor] = useState(false);
  const infoClose = () => {
    setInfoAnchor(false);
  };
  const setInfo = (i: number) => {
    setInfoAnchor(false);
    if (i) {
      dispatch(changeConnect(null));
      navigate("/");
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };
  const infoHandle = () => {
    if (isMobile) {
      showMobileInfo(true);
    } else {
      setInfoAnchor(true);
    }
  };
  // END TEMP

  const getWalletComponent = () => {
    switch (network.sub) {
      case "Ethereum":
      case "Polygon":
      case "Avalanche": {
        return (
          <Web3Button
            label={isMobile ? "Connect" : "Connect wallet"}
            icon="hide"
            avatar="hide"
          />
        );
      }
      case "Solana": {
        return <WalletMultiButton />;
      }
      case "Stellar": {
        return (
          <div className="h-[40px] relative">
            <button
              onClick={() => connectSteller()}
              className="rounded-lg h-[40px] px-[15px] py-[10px] flex items-center text-base md:bg-[#2e2d4e] bg-[#242429] md:border-[0px] border-[0.5px] border-[#ACACAE]"
            >
              {selectedAccount ? getShortAddress(selectedAccount) : "Connect Wallet"}
            </button>
          </div>
        );
      }
      default:
        <>
          <div className="ml-5 h-[40px] relative">
            {connect ? (
              <button
                className="rounded-lg px-[20px] py-[10px] flex items-center text-base md:bg-[#2e2d4e] bg-[#242429] md:border-[0px] border-[0.5px] border-[#ACACAE]"
                onClick={infoHandle}
              >
                <img
                  src={connect?.icon || ""}
                  alt="currency"
                  className="mr-2 w-[24px] h-[24px]"
                />
                GALH....Z7I7
              </button>
            ) : (
              <button
                className="rounded-lg px-[20px] py-[10px] flex items-center text-base md:bg-[#2e2d4e] bg-[#242429] md:border-[0px] border-[0.5px] border-[#ACACAE]"
                onClick={walletHandle}
              >
                {isMobile ? "Connect" : "Connect wallet"}
              </button>
            )}
            {!isMobile && (
              <>
                <MenuList
                  top={50}
                  data={network.wallet}
                  minWidth={150}
                  anchor={walletAnchor}
                  close={walletClose}
                  callback={setWallet}
                />
                <InfoList
                  top={50}
                  minWidth={150}
                  anchor={infoAnchor}
                  close={infoClose}
                  callback={setInfo}
                  size={25}
                />
              </>
            )}
          </div>
          {isMobile && (
            <>
              {Boolean(walletAnchor) && (
                <MobileList
                  title="Connect wallet"
                  sub="Connect your wallet compatible with the  network"
                  data={network.wallet}
                  close={walletClose}
                  callback={setWallet}
                />
              )}
            </>
          )}
        </>;
    }
  };

  return <div className="ml-5 h-[40px] relative">{getWalletComponent()}</div>;
}

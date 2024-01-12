import { useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { changeNet } from "redux/network";

// Componant
import MoreInfo from "./MoreInfo";
import MenuList from "./MenuList";
import MobileList from "./MobileList";

// Icon
import logo from "../assets/img/logo.svg";
import admin from "../assets/img/icon/admin.svg";

// Constants
import {
  CURRENCY,
  LANGUAGE,
  CONNECTED,
  LOGOUT,
} from "../config/constants/demo";

import { NETWORK } from "../config/constants/networks";

import useConfig from "hooks/useConfig";
import { changeBridge, setBridgeNet } from "redux/bridge";
import { changeCurrency, changeConnect, changeLanguage } from "redux/info";
import WalletButton from "./WalletButton";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isMobile } = useConfig();
  const { pathname } = useLocation();
  const network = useAppSelector((state) => state.network);
  const bridge = useAppSelector((state) => state.bridge);
  const { currency, language, connect } = useAppSelector((state) => state.info);

  const isHeader = useMemo(() => {
    return pathname !== "/login";
  }, [pathname]);

  const isAdmin = useMemo(() => {
    return pathname === "/dashboard" || pathname === "/stables";
  }, [pathname]);

  const [copied, setCopied] = useState(false);
  const [logout, setLogout] = useState(false);
  const [netAnchor, setNetAnchor] = useState(false);
  const [langAnchor, setLangAnchor] = useState(false);
  const [mobileInfo, setMobileInfo] = useState(false);
  const [infoAnchor, setInfoAnchor] = useState(false);
  const [currencyAnchor, setCurrencyAnchor] = useState(false);

  const currencyHandle = () => {
    setCurrencyAnchor(true);
  };
  const currencyClose = () => {
    setCurrencyAnchor(false);
  };
  const setCurrency = (i: number) => {
    dispatch(changeCurrency(CURRENCY[i]));
    currencyClose();
  };

  const langHandle = () => {
    setLangAnchor(true);
  };
  const langClose = () => {
    setLangAnchor(false);
  };
  const setLang = (i: number) => {
    dispatch(changeLanguage(LANGUAGE[i]));
    langClose();
  };

  const netHandle = () => {
    setNetAnchor(true);
  };
  const netClose = () => {
    setNetAnchor(false);
  };
  const setNet = (i: number) => {
    netClose();

    if (connect !== null) {
      dispatch(changeConnect(null));
    }

    dispatch(changeNet(NETWORK[i]));
    if (bridge.rNet === i) {
      dispatch(setBridgeNet({ sNet: i, rNet: 0 }));
    } else {
      dispatch(setBridgeNet({ sNet: i }));
    }

    if (i === 1 || i === 3) {
      dispatch(
        changeBridge({
          sIdx: 0,
          rIdx: 0,
          sNet: i,
          rNet: i === 1 ? 3 : 1,
        })
      );
    }
  };

  const infoHandle = () => {
    if (isMobile) {
      setMobileInfo(true);
    } else {
      setInfoAnchor(true);
    }
  };

  const showMobileInfo = () => {
    setMobileInfo(true);
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

  const logoutHandle = (e: any) => {
    navigate("/login");
    setLogout(false);
  };

  return (
    <header className="flex items-center justify-between w-full md:pt-10 pt-2 md:px-0 px-5">
      <div className="hidden md:flex items-center">
        <Link to="/">
          <img src={logo} alt="logo" className="h-10 my-[2px]" />
        </Link>

        {isHeader && (
          <>
            <div className="ml-10 relative">
              <button
                className="rounded-lg px-[20px] py-[8px] flex items-center text-base md:bg-[#2e2d4e] bg-[#242429] md:border-[0px] border-[0.5px] border-[#ACACAE]"
                onClick={currencyHandle}
              >
                <img
                  src={currency.icon}
                  alt="currency"
                  className="mr-2 w-[24px] h-[24px]"
                />
                {currency.name}
              </button>
              <MenuList
                top={50}
                minWidth={200}
                data={CURRENCY}
                anchor={currencyAnchor}
                close={currencyClose}
                callback={setCurrency}
              />
            </div>
            <div className="ml-5 relative">
              <button
                onClick={langHandle}
                className="rounded-lg px-[10px] py-[8px] flex items-center cursor-pointer bg-[#2e2d4e]"
              >
                <img
                  src={language.icon}
                  alt="lang"
                  className="w-[24px] h-[24px]"
                />
              </button>
              <MenuList
                top={50}
                minWidth={200}
                data={LANGUAGE}
                anchor={langAnchor}
                close={langClose}
                callback={setLang}
              />
            </div>
          </>
        )}
      </div>
      <div className="md:hidden" onClick={() => setMobileInfo(true)}>
        <img
          src={admin}
          alt="user"
          className="w-[44px] h-[40px] rounded-full"
        />
      </div>

      {copied && (
        <div className="absolute flex top-0 left-0 z-30 w-full justify-center">
          <div className="bg-[#5A4EE8] flex items-center text-base cursor-pointer md:text-base px-[20px]  md:py-[8px] py-[5px] text-sm absolute md:rounded-lg rounded-full md:top-[40px] top-[8px]">
            Address copied
          </div>
        </div>
      )}

      <div className="flex items-center">
        {isHeader && (
          <>
            <div className="relative">
              <button
                onClick={netHandle}
                className="rounded-lg p-[10px] flex items-center cursor-pointer md:bg-[#2e2d4e] bg-[#242429] md:border-[0px] border-[0.5px] border-[#ACACAE] h-[40px]"
              >
                <img
                  src={network.icon}
                  alt="net"
                  className="w-[24px] h-[24px]"
                />
              </button>
              {!isMobile && (
                <MenuList
                  top={50}
                  minWidth={230}
                  data={NETWORK}
                  anchor={netAnchor}
                  close={netClose}
                  callback={setNet}
                />
              )}
            </div>
            <WalletButton
              setCopied={setCopied}
              showMobileInfo={showMobileInfo}
            />
          </>
        )}
        {isAdmin && (
          <div className="ml-5 relative">
            <button
              className="rounded-lg px-[20px] py-[10px] flex items-center text-base md:bg-[#2e2d4e] bg-[#242429] md:border-[0px] border-[0.5px] border-[#ACACAE]"
              onClick={() => setLogout(true)}
            >
              <img
                src={admin}
                alt="currency"
                className="mr-2 w-[24px] h-[24px]"
              />
              Admin
            </button>
            {logout && (
              <>
                <div className="absolute left-0 py-2 rounded-lg bg-[#2e2d4e] z-20 top-[50px] min-w-[150px]">
                  <div className="flex flex-col">
                    <li
                      className="py-2 px-5 flex cursor-pointer"
                      onClick={logoutHandle}
                    >
                      <div className="mr-3 w-[24px] h-[24px]">
                        <img
                          src={LOGOUT[0].icon}
                          alt="currency"
                          className="w-[24px] h-[24px]"
                        />
                      </div>
                      <div>
                        <span className="text-sm">{LOGOUT[0].name}</span>
                      </div>
                    </li>
                  </div>
                </div>
                <div
                  className="fixed w-screen h-screen z-10 top-0 left-0"
                  onClick={() => setLogout(false)}
                />
              </>
            )}
          </div>
        )}
      </div>
      {isMobile && (
        <>
          {Boolean(netAnchor) && (
            <MobileList
              title="Choose network"
              sub="Choose your preferred network"
              data={NETWORK}
              close={netClose}
              callback={setNet}
            />
          )}

          {Boolean(mobileInfo) && (
            <MoreInfo
              connect={connect}
              infoData={CONNECTED}
              infoHandle={infoHandle}
              infoCallback={setInfo}
              wallet={network.wallet}
              langIcon={language.icon}
              currency={currency}
              currencyCallback={setCurrency}
              langCallback={setLang}
              close={() => setMobileInfo(false)}
            />
          )}
        </>
      )}
    </header>
  );
};

export default Header;

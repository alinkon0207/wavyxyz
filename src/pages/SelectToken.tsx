import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Icon
import { ReactComponent as SearchIcon } from "assets/img/icon/search.svg";

// Component
import Card from "components/Card";
import MobileCard from "components/MobileCard";

// Constant
import useConfig from "hooks/useConfig";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { changeSetToken } from "redux/selectToken";
import { setSendToken } from "redux/send";
import { setSwapToken } from "redux/swap";
import { setBridgeToken } from "redux/bridge";
import { setTopUpToken } from "redux/topUp";
import { changeMethod } from "redux/info";
import useWallet from "hooks/wallets";
import _get from "lodash/get";
import { formatNumber } from "utils/common";

const SelectToken = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectToken = useAppSelector((state) => state.selectToken);
  const { currency } = useAppSelector((state) => state.info);

  const { isMobile } = useConfig();
  const { tokenBalances, tokensBalanceFiat } = useWallet();

  const [value, setValue] = useState("");

  const setToken = (one: any) => {
    switch (selectToken.key) {
      case "SEND":
        dispatch(setSendToken({ [selectToken.type]: one.idx }));
        break;
      case "SWAP":
        dispatch(setSwapToken({ [selectToken.type]: one.idx }));
        break;
      case "BRIDGE":
        dispatch(setBridgeToken({ [selectToken.type]: one.idx }));
        break;
      case "TOPUP":
        dispatch(setTopUpToken({ [selectToken.type]: one.idx }));
        dispatch(changeMethod({ title: "", icon: "", list: [] }));
    }
    dispatch(changeSetToken({ key: "", order: 0, type: "" }));
    navigate(-1);
  };

  const tokens = useMemo(() => {
    if (selectToken.tokens) {
      return selectToken.tokens.filter(
        (t: any, i: number) => t.idx !== selectToken.order
      );
    } else return [];
  }, [selectToken]);

  if (isMobile) {
    return (
      <MobileCard title="Select Currency" back={() => navigate(-1)}>
        <div className="flex flex-col w-full px-5">
          <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-1 px-4">
            <SearchIcon className="absolute h-[25px]" />
            <input
              className="w-full bg-transparent pl-8"
              placeholder="Search"
              onChange={(e: any) => setValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full rounded-lg py-3 mt-5 mb-[100px]">
            <div className="w-full">
              {tokens
                .filter((e: any) => {
                  const string =
                    e.name.toLowerCase() + " " + e.sub.toLowerCase();
                  return string.search(value.toLocaleLowerCase()) !== -1;
                })
                .map(({ name, sub, icon, amount, price, idx }: any) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setToken({ name, sub, icon, amount, price, idx })
                    }
                    className="flex items-center justify-between border-b-[1px] border-[#36363A] py-3 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center border-2 border-[#FFFFFF] rounded-full mr-2">
                        <img
                          src={
                            icon
                              ? icon
                              : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                                sub
                          }
                          alt="icon"
                          className="w-[25px] h-[25px] bg-white rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-Unbounded">
                          {name}
                        </p>
                        <p className="text-xs text-light-dark">{sub}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium font-Unbounded">
                        {formatNumber(_get(tokenBalances, name, 0))}
                      </p>
                      <p className="text-xs font-medium text-light-dark text-right">
                        {formatNumber(_get(tokensBalanceFiat, name, 0))}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </MobileCard>
    );
  } else {
    return (
      <Card title="Select Stable" back={() => navigate(-1)}>
        <div className="flex flex-col w-full">
          <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-1 px-4">
            <SearchIcon className="absolute h-[25px]" />
            <input
              className="w-full bg-transparent pl-8"
              placeholder="Search"
              onChange={(e: any) => setValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full rounded-lg bg-dark py-3 pl-5 mt-5">
            <div className="h-[450px] overflow-auto w-full pr-5">
              {tokens
                .filter((e: any) => {
                  const string =
                    e.name.toLowerCase() + " " + e.sub.toLowerCase();
                  return string.search(value.toLocaleLowerCase()) !== -1;
                })
                .map(({ name, sub, icon, amount, price, idx }: any) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setToken({ name, sub, icon, amount, price, idx })
                    }
                    className="flex items-center justify-between border-b-[1px] border-[#36363A] py-3 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center border-2 border-[#FFFFFF] rounded-full mr-2">
                        <img
                          src={
                            icon
                              ? icon
                              : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                                sub
                          }
                          alt="icon"
                          className="w-[25px] h-[25px] bg-white rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-Unbounded">
                          {name}
                        </p>
                        <p className="text-xs text-light-dark">{sub}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium font-Unbounded">{`${formatNumber(
                        _get(tokenBalances, name, 0)
                      )} ${name}`}</p>
                      <p className="text-xs font-medium text-light-dark text-right">{`${
                        currency.mark
                      }${formatNumber(_get(tokensBalanceFiat, name, 0))}`}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }
};

export default SelectToken;

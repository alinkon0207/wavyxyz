import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import _get from "lodash/get";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";

// Component
import Card from "components/Card";
import MobileCard from "components/MobileCard";

// Icon
import exchange from "assets/img/icon/exchange.svg";
import { ReactComponent as EastIcon } from "assets/img/icon/arrow-right.svg";
import { ReactComponent as KeyboardArrowDownIcon } from "assets/img/icon/chevron-down.svg";

import useConfig from "hooks/useConfig";
import { useAppSelector, useAppDispatch } from "hooks/useRedux";
import { changeSend } from "redux/send";
import { changeSetToken } from "redux/selectToken";
import { getOffers } from "services/firebase";
import useWallet from "hooks/wallets";
import { formatNumber } from "utils/common";

const Send = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isMobile } = useConfig();
  const send = useAppSelector((state) => state.send);
  const network = useAppSelector((state) => state.network);

  const { selectedAccount } = useWallet();

  const [offers, setOffers] = useState([]);

  const sendData = useMemo(() => {
    return {
      sender: _find(network.token, ["idx", send.sIdx]) || {},
      receiver: _find(network.token, ["idx", send.rIdx]) || {},
    };
  }, [network.token, send]);

  const fetchOffers = async () => {
    const offers = await getOffers(
      network.chainId,
      selectedAccount,
      _get(sendData, "receiver.idx", -1),
      _get(sendData, "sender.idx", -1)
    );

    setOffers(offers);
  };

  const changOrder = () => {
    const tRIsx = send.sIdx;
    const tSIsx = send.rIdx;
    const tSEND = { ...send, sIdx: tSIsx, rIdx: tRIsx };
    dispatch(changeSend(tSEND));
  };

  const selectToken = (order: number, type: string) => {
    dispatch(
      changeSetToken({ key: "SEND", order, type, tokens: network.token })
    );
    navigate("/select");
  };

  useEffect(() => {
    fetchOffers();

    // eslint-disable-next-line
  }, [network.chainId, sendData, selectedAccount]);

  useEffect(() => {
    if (
      // (["solana", "stellar"].indexOf((network.sub || "").toLowerCase())) >= 0 &&
      _isEmpty(sendData.sender) &&
      _isEmpty(sendData.receiver)
    ) {
      const tSEND = {
        ...send,
        sIdx: _get(network, "token.0.idx", 0),
        rIdx: _get(network, "token.1.idx", 1),
      };
      dispatch(changeSend(tSEND));
    }

    // eslint-disable-next-line
  }, [network.sub, network.token]);

  if (isMobile) {
    return (
      <MobileCard title="Send" back={() => navigate("/")}>
        <div className="w-full flex items-end justify-between px-5 mb-10 relative">
          <div className="flex flex-col">
            <p className="text-sm text-[#ACACAE] mb-2">Send</p>
            <div
              className="flex items-center cursor-pointer bg-[#242429] border-[0.6px] border-[#ACACAE] rounded-xl px-5 py-2"
              onClick={() => selectToken(send.rIdx, "sIdx")}
            >
              <img
                src={
                  sendData.sender.icon
                    ? sendData.sender.icon
                    : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                      sendData.sender.name
                }
                alt="token"
                className="w-[24px] h-[24px] bg-white rounded-full"
              />
              <span className="text-sm mx-2">{sendData.sender.name}</span>
              <KeyboardArrowDownIcon className="w-3" />
            </div>
          </div>
          <img
            src={exchange}
            alt="token"
            className="w-[30px] h-[30px] cursor-pointer absolute bottom-1"
            style={{ left: "calc(50% - 12px)" }}
            onClick={changOrder}
          />
          <div className="flex flex-col">
            <p className="text-sm text-[#ACACAE] mb-2">Receive</p>
            <div
              className="flex items-center cursor-pointer bg-[#242429] border-[0.6px] border-[#ACACAE] rounded-xl px-5 py-2"
              onClick={() => selectToken(send.sIdx, "rIdx")}
            >
              <img
                src={
                  sendData.receiver.icon
                    ? sendData.receiver.icon
                    : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                      sendData.receiver.name
                }
                alt="token"
                className="w-[24px] h-[24px] bg-white rounded-full"
              />
              <span className="text-sm mx-2">{sendData.receiver.name}</span>
              <KeyboardArrowDownIcon className="w-3" />
            </div>
          </div>
        </div>
        <div className="bg-[#242429] rounded-t-3xl py-[30px] px-5">
          <div>
            {(offers || []).map(
              ({
                rate,
                min,
                send,
                sendAmount,
                receive,
                receiveAmount,
                offerId,
                status,
                createdBy,
              }: any) => (
                <div
                  key={offerId}
                  onClick={() =>
                    Number(status) === 0 && navigate(`check/${offerId}`)
                  }
                  className={`w-full grid mb-4 cursor-pointer border-light-dark border-[0.6px] p-5 rounded-xl ${
                    selectedAccount === createdBy ? "d-none" : ""
                  }`}
                >
                  <div className="flex">
                    <div className="flex flex-col w-1/2">
                      <p className="text-xs">You send</p>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center cursor-pointer mt-1 mb-2">
                          <img
                            src={
                              receive.icon
                                ? receive.icon
                                : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                                  receive.name
                            }
                            alt="token"
                            className="w-[24px] h-[24px] bg-white rounded-full"
                          />
                          <span className="text-base ml-2">{receive.name}</span>
                        </div>
                        <EastIcon />
                      </div>
                    </div>
                    <div className="flex flex-col w-1/2 ml-10">
                      <p className="text-xs">You receive</p>
                      <div className="flex items-center cursor-pointer mt-1 mb-2">
                        <img
                          src={
                            send.icon
                              ? send.icon
                              : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                                send.name
                          }
                          alt="token"
                          className="w-[24px] h-[24px] bg-white rounded-full"
                        />
                        <span className="text-base ml-2">{send.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center">
                      <p className="text-xs text-light-dark mr-1">
                        Exchange rate
                      </p>
                      <p className="text-sm">
                        {formatNumber(rate)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xs text-light-dark mr-1">Available</p>
                      <p className="text-sm">
                        {formatNumber(sendAmount)} {send.name}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xs text-light-dark mr-1">limit</p>
                      <p className="text-sm">
                        {formatNumber(min)}-
                        {formatNumber(receiveAmount)}{" "}
                        {receive.name}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="h-[200px]" />
        </div>
        <div className="flex w-full fixed items-center justify-between bottom-0 px-5 py-6 bg-[#151518] rounded-t-3xl">
          <button
            className="text-center text-bold py-4 px-3 min-w-[150px] text-sm font-medium bg-[#FFFFFF] rounded-lg text-[#151518] cursor-pointer"
            onClick={() => navigate("offers")}
          >
            My offers
          </button>
          <button
            className="px-3 text-center py-4 min-w-[150px] bg-[#5a4ee8] rounded-lg cursor-pointe text-sm"
            onClick={() => navigate("create-offer")}
          >
            Create a new offer
          </button>
        </div>
      </MobileCard>
    );
  } else {
    return (
      <Card title="Send" back={() => navigate("/")}>
        <div className="w-full flex items-center justify-between relative">
          <div className="flex items-center">
            <p className="text-base mr-2">Send</p>
            <div
              className="flex items-center cursor-pointer border-[0.6px] border-[#ACACAE] rounded-md px-2 py-2"
              onClick={() => selectToken(send.rIdx, "sIdx")}
            >
              <img
                src={
                  sendData.sender.icon
                    ? sendData.sender.icon
                    : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                      sendData.sender.name
                }
                alt="token"
                className="w-[24px] h-[24px] bg-white rounded-full"
              />
              <span className="text-base mx-2">{sendData.sender.name}</span>
              <KeyboardArrowDownIcon className="w-3" />
            </div>
          </div>
          <img
            src={exchange}
            alt="token"
            className="w-[24px] h-[24px] cursor-pointer absolute"
            style={{ left: "calc(50% - 12px)" }}
            onClick={changOrder}
          />
          <div className="flex items-center">
            <p className="text-base mr-2">Receive</p>
            <div
              className="flex items-center cursor-pointer border-[0.6px] border-[#ACACAE] rounded-md px-2 py-2"
              onClick={() => selectToken(send.sIdx, "rIdx")}
            >
              <img
                src={
                  sendData.receiver.icon
                    ? sendData.receiver.icon
                    : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                      sendData.receiver.name
                }
                alt="token"
                className="w-[24px] h-[24px] bg-white rounded-full"
              />
              <span className="text-base mx-2">{sendData.receiver.name}</span>
              <KeyboardArrowDownIcon className="w-3" />
            </div>
          </div>
        </div>
        {(offers || []).map(
          ({
            rate,
            min,
            send,
            sendAmount,
            receive,
            receiveAmount,
            status,
            offerId,
            createdBy,
          }: any) => {
            return (
              <div
                key={offerId}
                onClick={() =>
                  Number(status) === 0 && navigate(`check/${offerId}`)
                }
                className={`w-full grid mt-4 cursor-pointer border-light-dark border-[0.6px] px-3 py-2 rounded-lg grid-cols-3 bg-[#19181F] ${
                  selectedAccount === createdBy ? "d-none" : ""
                }`}
              >
                <div className="flex flex-col">
                  <p className="text-xs">You send</p>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center cursor-pointer mt-1 mb-2">
                      <img
                        src={
                          receive.icon
                            ? receive.icon
                            : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                              receive.name
                        }
                        alt="token"
                        className="w-[24px] h-[24px] bg-white rounded-full"
                      />
                      <span className="text-base ml-2">{receive.name}</span>
                    </div>
                    <EastIcon />
                  </div>
                  <div>
                    <p className="text-xs text-light-dark">Exchange rate</p>
                    <p className="text-sm">
                      {formatNumber(rate)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col mx-auto">
                  <p className="text-xs">You receive</p>
                  <div className="flex items-center cursor-pointer mt-1 mb-2">
                    <img
                      src={
                        send.icon
                          ? send.icon
                          : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                            send.name
                      }
                      alt="token"
                      className="w-[24px] h-[24px] bg-white rounded-full"
                    />
                    <span className="text-base ml-2">{send.name}</span>
                  </div>
                  <div>
                    <p className="text-xs text-light-dark">Available</p>
                    <p className="text-sm">
                      {formatNumber(sendAmount)} {send.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-xs"></p>
                  <div className="line-flex">
                    {Number(status) === 0 && (
                      <div className="inline-flex py-2 px-2 items-center text-xs cursor-pointer mt-1 mb-2 rounded-lg bg-dark-primary">
                        Accept offer
                        <EastIcon className="w-4 ml-2" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-light-dark">limit</p>
                    <p className="text-sm">
                      {formatNumber(min)}-
                      {formatNumber(receiveAmount)}{" "}
                      {receive.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        )}
        <div className="flex justify-around items-center mt-5 w-full">
          <button
            className="text-center text-bold py-4 px-3 min-w-[150px] text-base font-medium bg-[#FFFFFF] rounded-lg text-[#151518] cursor-pointer"
            onClick={() => navigate("offers")}
          >
            My offers
          </button>
          <button
            className="px-3 text-center py-4 min-w-[150px] bg-[#5a4ee8] rounded-lg cursor-pointer"
            onClick={() => navigate("create-offer")}
          >
            Create a new offer
          </button>
        </div>
      </Card>
    );
  }
};

export default Send;

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import _find from "lodash/find";

// component
import Card from "components/Card";
import MobileCard from "components/MobileCard";
import ValueInput from "components/ValueInput";

// Constatn
import useConfig from "hooks/useConfig";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { changeSetToken } from "redux/selectToken";
import useWallet from "hooks/wallets";
import { changeSend } from "redux/send";
import { formatNumber } from '../../utils/common';

const NewOffer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { tokenBalances, fees } = useWallet();
  const send = useAppSelector((state) => state.send);
  const network = useAppSelector((state) => state.network);
  const { isMobile } = useConfig();

  const [min, setMin] = useState(send.min);
  const [rate, setRate] = useState<string | number>(send.rate);
  // const [rateError, setRateError] = useState(false);
  const [sendAmount, setSendAmount] = useState<string | number>(send.sAmount);
  const [receiveAmount, setReceiveAmount] = useState<string | number>(
    send.rAmount
  );

  const [sendErr, setSendErr] = useState("");
  const [minErr, setMinErr] = useState("");

  const offerData = useMemo(() => {
    return {
      send: _find(network.token, ['idx', send.sIdx]) || {},
      receive: _find(network.token, ['idx', send.rIdx]) || {},
    };
  }, [network.token, send]);

  const handleRate = (e: any) => {
    setRate(e.target.value);
    const _rate = Number(e.target.value) || 0;

    setReceiveAmount(
      ((Number(sendAmount) || 0) * _rate).toFixed(
        _get(offerData, "receive.contract.decimals", 0)
      )
    );
  };

  const selectToken = (order: number, type: string) => {
    dispatch(
      changeSetToken({ key: "SEND", order, type, tokens: network.token })
    );
    navigate("/select");
  };

  const setSendVal = (val) => {
    setSendAmount(val);
    setReceiveAmount(
      (Number(val) * Number(rate)).toFixed(
        _get(offerData, "receive.contract.decimals", 0)
      )
    );
  };

  const setReceiveVal = (val) => {
    setReceiveAmount(val);
    setRate((Number(val) / Number(sendAmount)).toFixed(2));
  };

  useEffect(() => {
    // setRateError((tokenBalances[offerData.receive.name] || 0) < rate);
    // eslint-disable-next-line
  }, [rate]);

  useEffect(() => {
    dispatch(
      changeSend({
        ...send,
        sAmount: formatNumber(sendAmount),
        rAmount: formatNumber(receiveAmount),
        rate: formatNumber(rate),
        min: formatNumber(min),
        max: formatNumber(receiveAmount),
      })
    );

    // eslint-disable-next-line
  }, [rate, sendAmount, receiveAmount, min]);

  useEffect(() => {
    if (!_isEmpty(tokenBalances)) {
      let _sendAmt = Number(sendAmount);
      const _tBal = _get(tokenBalances, offerData.send.name, 0);
      if(Number(fees) > 0) {
        _sendAmt = _sendAmt + ((_sendAmt * fees) / 100);
      }

      if (Number(_sendAmt) > _tBal) {
        if (Number(fees) > 0) {
          setSendErr(`Insufficient balance. Amount should be less then ${(_tBal - ((_tBal * fees) / 100))}`);
        } else {
          setSendErr(`Insufficient balance.`);
        }
      } else {
        setSendErr("");
      }
    }

    // eslint-disable-next-line
  }, [sendAmount, tokenBalances]);

  useEffect(() => {
    if(Number(receiveAmount) > 0 && Number(receiveAmount) < Number(min)) {
      setMinErr("Min amount exceeds receive amount");
    } else {
      setMinErr("");
    }
  }, [receiveAmount, min]);

  if (isMobile) {
    return (
      <MobileCard
        title="Create a new offer"
        fontSize={20}
        back={() => navigate("/send")}
      >
        <div className="bg-[#242429] rounded-t-3xl py-[30px] px-5 flex flex-col items-center justify-center w-full">
          <div className="w-full h-full pb-[100px]">
            <ValueInput
              onChange={() => selectToken(send.rIdx, "sIdx")}
              title="Send"
              available={true}
              availableAmt={formatNumber(_get(tokenBalances, offerData.send.name, 0))}
              value={sendAmount}
              setValue={(v) => setSendVal(v)}
              token={offerData.send}
              placeholder="0"
              classes="mr-2"
            />
            <ValueInput
              onChange={() => selectToken(send.sIdx, "rIdx")}
              title="Receive"
              value={receiveAmount}
              setValue={(v) => setReceiveVal(v)}
              token={offerData.receive}
            />
            <div>
              <p className="text-sm text-light-dark">Exchange rate</p>
              <div className="flex items-center">
                <p className="text-2xl">{`1 ${offerData.send.name} =`}</p>
                <div
                  className="flex rounded-lg border-[0.6px] px-5 py-3 ml-10 w-3/5"
                  // style={{ borderColor: rateError ? "#FF0004" : "#ACACAE" }}
                >
                  <input
                    lang="en"
                    type="number"
                    className="text-3xl w-full p-0 border-none leading-none text-[#ffffff] bg-transparent"
                    value={rate}
                    onChange={handleRate}
                  />
                  <div className="flex items-center w-full cursor-pointer">
                    <img
                      src={offerData.receive.icon}
                      alt="token"
                      className="w-[24px] h-[24px]"
                    />
                    <span className="text-base mx-2">
                      {offerData.receive.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-5  w-full">
              <p className="text-2xl mb-2">Set order limit</p>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col w-1/2">
                  <span className="text-sm text-light-dark mb-3">{`Min. order (${offerData.receive.name})`}</span>
                  <div className="rounded-lg border-[0.6px] px-5 py-2 " style={{ borderColor: minErr ? "#FF0004" : "#ACACAE" }}>
                    <input
                      lang="en"
                      type="number"
                      className="w-full p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
                      value={min}
                      onChange={(e: any) => setMin(e.target.value)}
                    />
                    <span className="text-xs text-rose-700">{minErr}</span>
                  </div>
                </div>
                <div className="text-3xl mx-5">-</div>

                <div className="flex flex-col w-1/2">
                  <span className="text-sm text-light-dark mb-3">{`Max. order (${offerData.receive.name})`}</span>
                  <div className="flex flex-col rounded-lg border-[0.6px] px-5 py-2 border-[#ACACAE}] ">
                    <input
                      lang="en"
                      type="number"
                      className="w-full p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
                      value={receiveAmount}
                      disabled={true}
                      // onChange={(e: any) => setMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              className="text-center mt-10 py-4 w-full bg-[#5a4ee8] rounded-lg"
              disabled={
                Number(receiveAmount) <= 0 ||
                sendAmount > tokenBalances[offerData.send.name] ||
                minErr !== ""
              }
              onClick={() => navigate("confirm")}
            >
              Create an offer
            </button>
          </div>
        </div>
      </MobileCard>
    );
  } else {
    return (
      <Card title="Create a new offer" back={() => navigate("/send")} lg={650}>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-10">
            <ValueInput
              title="Send"
              available={true}
              availableAmt={formatNumber(_get(tokenBalances, offerData.send.name, 0))}
              value={sendAmount}
              setValue={(v) => setSendVal(v)}
              token={offerData.send}
              classes="mr-2"
              placeholder="0"
              onChange={() => selectToken(send.rIdx, "sIdx")}
              error={sendErr}
            />
            <ValueInput
              onChange={() => selectToken(send.sIdx, "rIdx")}
              title="Receive"
              value={receiveAmount}
              setValue={(v) => setReceiveVal(v)}
              token={offerData.receive}
            />
          </div>
          <div>
            <p className="text-sm">Exchange rate</p>
            <div className="flex items-center">
              <p className="text-2xl">{`1 ${offerData.send.name} =`}</p>
              <div
                className="flex rounded-lg border-[0.6px] px-5 py-2 ml-10"
                // style={{ borderColor: rateError ? "#FF0004" : "#ACACAE" }}
              >
                <input
                  lang="en"
                  type="number"
                  className="text-lg p-0 border-none leading-none text-[#ffffff] bg-transparent"
                  value={rate}
                  onChange={handleRate}
                />
                <div className="flex items-center w-full cursor-pointer">
                  <img
                    src={offerData.receive.icon}
                    alt="token"
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-base mx-2">
                    {offerData.receive.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="my-5">
            <p className="text-2xl mb-2">Set order limit</p>
            <div className="flex items-center">
              <div className="flex flex-col rounded-lg border-[0.6px] px-5 py-2 w-[35%] " style={{ borderColor: minErr ? "#FF0004" : "#ACACAE" }}>
                <span className="text-sm">{`Min. order (${offerData.receive.name})`}</span>
                <input
                  lang="en"
                  type="number"
                  className="p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
                  value={min}
                  onChange={(e: any) => setMin(e.target.value)}
                />
                <span className="text-xs text-rose-700">{minErr}</span>
              </div>
              <div className="text-3xl mx-5">-</div>
              <div className="flex flex-col rounded-lg border-[0.6px] px-5 py-2 border-[#ACACAE}] w-[35%] ">
                <span className="text-sm">{`Max. order (${offerData.receive.name})`}</span>
                <input
                  lang="en"
                  type="number"
                  className="p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
                  value={receiveAmount}
                  disabled={true}
                  // onChange={(e: any) => setMax(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              className="text-center mt-10 py-4 w-[60%] bg-[#5a4ee8] rounded-lg"
              disabled={
                Number(receiveAmount) <= 0 ||
                sendAmount > tokenBalances[offerData.send.name] ||
                minErr !== ""
              }
              onClick={() => navigate("confirm")}
            >
              Create an offer
            </button>
          </div>
        </div>
      </Card>
    );
  }
};

export default NewOffer;

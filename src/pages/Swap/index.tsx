import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _get from "lodash/get";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";
import _debounce from "lodash/debounce";

// Icon
import { ReactComponent as SwapIcon } from "assets/img/icon/swap-btn.svg";

// component
import Card from "components/Card";
import ValueInput from "components/ValueInput";

// Constatn
import useConfig from "hooks/useConfig";
import MobileCard from "components/MobileCard";
import MobileSwapConfirm from "components/MobileSwapConfirm";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { changeSetToken } from "redux/selectToken";
import { changeSwap, setSwapToken } from "redux/swap";
import useWallet from "hooks/wallets";
import { calculateNonDecimalValue } from "utils/common";

const Swap = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isMobile } = useConfig();
  const swap = useAppSelector((state) => state.swap);
  const network = useAppSelector((state) => state.network);

  const { quoteSwap, tokenBalances } = useWallet();

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [rate, setRate] = useState("N/A");

  const [quoteErr, setQuoteErr] = useState("");

  const swapData = useMemo(() => {
    return {
      from: _find(network.token, ["idx", swap.sIdx]) || {},
      to: _find(network.token, ["idx", swap.rIdx]) || {},
    };
  }, [network.token, swap]);

  const changOrder = () => {
    dispatch(setSwapToken({ sIdx: swap.rIdx, rIdx: swap.sIdx }));
  };

  const selectToken = (order: number, type: string) => {
    dispatch(
      changeSetToken({ key: "SWAP", order, type, tokens: network.token })
    );
    navigate("/select");
  };

  const setRamount = async (fromAmount) => {
    try {
      if (Number(fromAmount) > 0) {
        const fromContract = _get(swapData, "from.contract");
        const from = fromContract.address;
        const to = _get(swapData, "to.contract.address");
        const amount = calculateNonDecimalValue(
          network.sub,
          Number(fromAmount),
          fromContract.decimals
        );

        const toAmt = await quoteSwap(from, to, amount);

        setToAmount(() => Number(toAmt).toFixed(4));

        if (Number(toAmt) > 0) {
          setRate(() =>
            Number((Number(toAmt) / Number(fromAmount)).toFixed(4)).toString()
          );
        }
      } else {
        setToAmount(() => "0");
      }
    } catch (error: any) {
      setToAmount(() => "0");
      setQuoteErr(error?.message);
    }
  };

  const setSamount = async (fromAmount) => {
    try {
      if (Number(fromAmount) > 0) {
        const fromContract = _get(swapData, "from.contract");
        const toContract = _get(swapData, "to.contract");
        const from = toContract.address;
        const to = fromContract.address;
        const amount = calculateNonDecimalValue(
          network.sub,
          Number(fromAmount),
          toContract.decimals
        );

        const toAmt = await quoteSwap(from, to, amount);

        setFromAmount(() => Number(toAmt).toFixed(4));

        if (Number(toAmt) > 0) {
          setRate(() =>
            Number((Number(toAmt) / Number(fromAmount)).toFixed(4)).toString()
          );
        }
      } else {
        setFromAmount(() => "0");
      }
    } catch (error: any) {
      setFromAmount(() => "0");
      setQuoteErr(error?.message);
    }
  };

  const getReceiveAmount = useCallback(_debounce(setRamount, 500), [
    quoteSwap,
    swapData,
  ]);
  const getSendAmount = useCallback(_debounce(setSamount, 500), [
    quoteSwap,
    swapData,
  ]);

  useEffect(() => {
    if (
      ["solana", "stellar"].indexOf((network.sub || "").toLowerCase()) >= 0 &&
      _isEmpty(swapData.from) &&
      _isEmpty(swapData.to)
    ) {
      const tSEND = {
        ...swap,
        sIdx: _get(network, "token.0.idx", undefined),
        rIdx: _get(network, "token.1.idx", undefined),
      };

      setTimeout(() => {
        dispatch(changeSwap(tSEND));
      }, 500);
    }

    // eslint-disable-next-line
  }, [network.sub, network.token]);

  const [isConfirm, setIsConfirm] = useState(false);

  // useEffect(() => {
  //   getReceiveAmount(fromAmount);
  //   setQuoteErr("");
  //   // eslint-disable-next-line
  // }, [fromAmount]);

  // useEffect(() => {
  //   getSendAmount(toAmount);
  //   setQuoteErr("");
  //   // eslint-disable-next-line
  // }, [toAmount]);

  useEffect(() => {
    dispatch(
      changeSwap({
        ...swap,
        fAmount: fromAmount,
        tAmount: toAmount,
        rate: Number(rate),
      })
    );
    // eslint-disable-next-line
  }, [fromAmount, toAmount, rate]);

  useEffect(() => {
    if (quoteSwap) {
      setFromAmount("1");
      getReceiveAmount(1);
    }
  }, [quoteSwap]);

  useEffect(() => {
    if (fromAmount) getReceiveAmount(fromAmount);
  }, [swapData.from]);

  if (isMobile) {
    return (
      <MobileCard title="Swap" back={() => navigate("/")}>
        <div
          style={{ height: "calc(100vh - 28px - 32px - 60px)" }}
          className=" py-[30px] px-5 flex flex-col justify-between"
        >
          <div className="w-full">
            <ValueInput
              title="From"
              available={true}
              value={swap.fAmount}
              setValue={(val) => {
                setFromAmount(val);
                getReceiveAmount(val);
                setQuoteErr("");
              }}
              token={swapData.from}
              onChange={() => selectToken(swap.rIdx, "sIdx")}
              availableAmt={_get(tokenBalances, swapData.from.name, 0)}
              error={
                _get(tokenBalances, swapData.from.name, 0) < fromAmount
                  ? "Insufficient balance"
                  : ""
              }
            />

            <div className="flex justify-center my-3">
              <SwapIcon
                className="h-[30px] w-[30px] cursor-pointer"
                onClick={changOrder}
              />
            </div>

            <ValueInput
              title="Receive"
              available={true}
              value={toAmount}
              setValue={(val) => {
                setToAmount(val);
                getSendAmount(val);
                setQuoteErr("");
              }}
              token={swapData.to}
              onChange={() => selectToken(swap.sIdx, "rIdx")}
              disabledValue={false}
              availableAmt={_get(tokenBalances, swapData.from.name, 0)}
            />
            <p className="rounded-lg py-1 text-[#CCC8F8] my-4">{`${rate} ${swapData.from.name} = ${swap.slippage} ${swapData.to.name}`}</p>

            <button
              className="w-full text-center py-4 mt-10 bg-[#5a4ee8] rounded-lg"
              onClick={() => setIsConfirm(true)}
              disabled={
                Number(toAmount) <= 0 ||
                Number(fromAmount) <= 0 ||
                _get(tokenBalances, swapData.to.name, 0) < toAmount ||
                _get(tokenBalances, swapData.from.name, 0) < fromAmount
              }
            >
              Preview Swap
            </button>
          </div>
          <div
            className="flex justify-between items-center w-100 mt-3 text-center"
            style={{ wordBreak: "break-all" }}
            dangerouslySetInnerHTML={{ __html: quoteErr }}
          ></div>
        </div>
        {isConfirm && (
          <MobileSwapConfirm
            data={swapData}
            equal={swap.slippage}
            close={() => setIsConfirm(false)}
          />
        )}
      </MobileCard>
    );
  } else {
    return (
      <Card title="Swap" back={() => navigate("/")}>
        <div className="flex flex-col w-full">
          <ValueInput
            title="From"
            available={true}
            value={fromAmount}
            setValue={(val) => {
              setFromAmount(val);
              getReceiveAmount(val);
              setQuoteErr("");
            }}
            token={swapData.from}
            onChange={() => selectToken(swap.rIdx, "sIdx")}
            availableAmt={_get(tokenBalances, swapData.from.name, 0)}
            error={
              _get(tokenBalances, swapData.from.name, 0) < fromAmount
                ? "Insufficient balance"
                : ""
            }
          />
          <div className="flex justify-center my-3">
            <SwapIcon
              className="h-[28px] w-[28px] cursor-pointer"
              onClick={changOrder}
            />
          </div>
          <ValueInput
            title="To"
            available={true}
            value={toAmount}
            setValue={(val) => {
              setToAmount(val);
              getSendAmount(val);
              setQuoteErr("");
            }}
            token={swapData.to}
            onChange={() => selectToken(swap.sIdx, "rIdx")}
            disabledValue={false}
            availableAmt={_get(tokenBalances, swapData.to.name, 0)}
          />
          <p className="bg-[#090912] rounded-lg py-1 px-6 text-[#B8ACFF] my-4">{`1 ${swapData.from.name} = ${rate} ${swapData.to.name}`}</p>

          <button
            className="w-full text-center py-4 mt-10 bg-[#5a4ee8] rounded-lg"
            onClick={() => navigate("preview")}
            disabled={
              Number(toAmount) <= 0 ||
              Number(fromAmount) <= 0 ||
              _get(tokenBalances, swapData.from.name, 0) < fromAmount
            }
          >
            Preview Swap
          </button>
        </div>
        <div
          className="flex justify-between items-center w-100 mt-10 text-center"
          style={{ wordBreak: "break-all" }}
          dangerouslySetInnerHTML={{ __html: quoteErr }}
        ></div>
      </Card>
    );
  }
};

export default Swap;

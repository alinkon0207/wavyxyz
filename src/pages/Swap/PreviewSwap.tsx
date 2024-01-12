import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import _find from "lodash/find";
import _get from "lodash/get";

// Icon
import { ReactComponent as EastIcon } from "assets/img/icon/arrow-right.svg";

// component
import Card from "components/Card";
import { useAppSelector } from "hooks/useRedux";
import useWallet from "hooks/wallets";

import {
  calculateNonDecimalValue,
  getTransactionUrl,
  sleep,
} from "utils/common";

const PreviewSwap = () => {
  const navigate = useNavigate();
  const swap = useAppSelector((state) => state.swap);
  const network = useAppSelector((state) => state.network);

  const { createSwap, quoteSwapAllowance } = useWallet();

  const [txStatus, setTxStatus] = useState("");

  const swapData = useMemo(() => {
    return {
      from: _find(network.token, ["idx", swap.sIdx]) || {},
      to: _find(network.token, ["idx", swap.rIdx]) || {},
    };
  }, [network.token, swap]);

  const makeSwap = async () => {
    try {
      const fromContract = _get(swapData, "from.contract");
      const _from = fromContract.address;
      const _to = _get(swapData, "to.contract.address");
      const _fromAmount = calculateNonDecimalValue(
        network.sub,
        Number(swap.fAmount) || 0,
        fromContract.decimals
      );
      const _slippage = swap.slippage;

      if (typeof quoteSwapAllowance === "function") {
        setTxStatus("Confirm Allowance Transaction on wallet.");

        const { hash: alHash, wait: alWait } = await quoteSwapAllowance(
          _from,
          _fromAmount,
          _to
        );

        setTxStatus(
          `Processing allowance, <a target="_blank" href="${getTransactionUrl(
            network.chainId,
            network.explorerUrl,
            alHash
          )}"><u>Check here.</u></>`
        );

        if (alWait) {
          await alWait;
        }

        sleep(1500);

        setTxStatus("Allowance Processed.");
      }

      setTxStatus("Confirm Transaction on wallet.");

      const { hash: wtHash, wait: wtWait } = await createSwap(
        _from,
        _to,
        _fromAmount,
        _slippage
      );

      setTxStatus(
        `Creating Swap, <a target="_blank" href="${getTransactionUrl(
          network.chainId,
          network.explorerUrl,
          wtHash
        )}"><u>Check here.</u></a>`
      );

      if (wtWait) {
        await wtWait;
      }

      setTimeout(function () {
        setTxStatus("Swaping successful.");
      }, 500);

      setTimeout(function () {
        navigate("/swap/success");
      }, 2000);
    } catch (error: any) {
      console.log("error", error.message);
      setTxStatus(error?.message);
    }
  };

  return (
    <Card title="Confirm Conversion">
      <div className="w-full flex items-center justify-around mb-8">
        <div className="flex flex-col items-center">
          <img
            src={swapData.from.icon}
            alt="token"
            className="w-[60px] h-[60px] mb-3"
          />
          <p className="text-sm mb-2">From</p>
          <p className="text-base font-Unbounded font-medium">{`${swap.fAmount} ${swapData.from.name}`}</p>
        </div>
        <EastIcon />
        <div className="flex flex-col items-center">
          <img
            src={swapData.to.icon}
            alt="token"
            className="w-[60px] h-[60px]  mb-3"
          />
          <p className="text-sm mb-2">Receive</p>
          <p className="text-base font-Unbounded font-medium">{`${swap.tAmount} ${swapData.to.name}`}</p>
        </div>
      </div>
      <div className="flex flex-col w-full rounded-lg border-[0.6px] px-5 py-4 border-[#ACACAE]">
        <div className="flex w-full items-center justify-between mb-5 text-sm">
          <p>Conversion Fee</p> <p>No fees</p>
        </div>
        <div className="flex w-full items-center justify-between text-sm">
          <p>Rate</p>{" "}
          <p>{`1 ${swapData.from.name} = ${swap.rate} ${swapData.to.name}`}</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full mt-10">
        <button
          className="text-center text-bold py-4 w-[150px] bg-transparent border-[2px] border-solid border-[#ffffff] rounded-lg cursor-pointer"
          onClick={() => navigate("/swap")}
        >
          Back
        </button>
        <button
          className="text-center py-4 w-[150px] bg-[#5a4ee8] rounded-lg cursor-pointer"
          onClick={() => makeSwap()}
        >
          Continue
        </button>
      </div>
      <div
        className="flex justify-between items-center w-100 mt-10 text-center"
        style={{ wordBreak: "break-all" }}
        dangerouslySetInnerHTML={{ __html: txStatus }}
      ></div>
    </Card>
  );
};

export default PreviewSwap;

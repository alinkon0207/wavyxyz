import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _get from "lodash/get";

// component
import Card from "components/Card";
import ValueInput from "components/ValueInput";
import { ReactComponent as InfoIcon } from "assets/img/icon/info.svg";
// Constatn
import useConfig from "hooks/useConfig";
import MobileCard from "components/MobileCard";
import { useAppSelector } from "hooks/useRedux";
import { getOffer } from "services/firebase";
import useWallet from "hooks/wallets";
import { ethers } from "ethers";
import _isEmpty from "lodash/isEmpty";
import { calculateNonDecimalValue, getTransactionUrl } from "utils/common";

const TopUp = () => {
  const navigate = useNavigate();
  const network = useAppSelector((state) => state.network);

  const { acceptOffer, processAllowance, tokenBalances } = useWallet();

  const { index } = useParams();
  const { isMobile } = useConfig();

  const [offer, setOffer] = useState({});

  const [fromVal, setFromVal] = useState(0);
  const [toVal, setToVal] = useState(0);

  const [toErr, setToErr] = useState("");

  const [txStatus, setTxStatus] = useState("");

  const fetchOffer = async () => {
    const _idx = isNaN(Number(index)) ? index : Number(index);
    const _offer = await getOffer(network.chainId, _idx);
    setOffer(_offer);
  };

  const processAcceptOffer = async () => {
    try {
      const contractAddress = _get(offer, "receive.address", 0);
      const contractDecimals = _get(offer, "receive.decimals", 0);

      const allowanceAmount = (
        (Number(toVal) || 0) +
        ((Number(toVal) || 0) * 0.25) / 100
      ).toFixed(contractDecimals);

      const amount = calculateNonDecimalValue(
        network.sub,
        toVal,
        contractDecimals
      );

      if (typeof processAllowance === "function") {
        setTxStatus("Confirm Transaction on wallet.");

        const { hash: hashAllowance, wait: waitAllowance } =
          await processAllowance(
            contractAddress,
            ethers.utils.parseUnits(allowanceAmount, contractDecimals)
          );

        setTxStatus(
          `Processing allowance, <a target="_blank" href="${getTransactionUrl(
            network.chainId,
            network.explorerUrl,
            hashAllowance
          )}"><u>Check here.</u></>`
        );

        await waitAllowance;
      }

      setTxStatus("Allowance Processed.");

      setTxStatus("Please confirm on your wallet");

      const { hash, wait } = await acceptOffer(index, amount);

      setTxStatus(
        `Accepting Offer, <a target="_blank" href="${getTransactionUrl(
          network.chainId,
          network.explorerUrl,
          hash
        )}"><u>Check here.</u></a>`
      );

      if (wait) {
        await wait;
      }

      setTxStatus("Offer Accepted.");

      navigate(
        `/send/success?txUrl=${getTransactionUrl(
          network.chainId,
          network.explorerUrl,
          hash
        )}`
      );
    } catch (error) {
      console.log("error", error);
      setTxStatus(_get(error, "message", ""));
    }
  };

  useEffect(() => {
    fetchOffer();

    // eslint-disable-next-line
  }, [index]);

  useEffect(() => {
    setFromVal(_get(offer, "sendAmount", 0));
    setToVal(_get(offer, "receiveAmount", 0));
  }, [offer]);

  useEffect(() => {
    setFromVal(
      Number(
        (toVal / Number(_get(offer, "rate", 0))).toFixed(
          _get(offer, "send.decimals", 0)
        )
      )
    );

    // eslint-disable-next-line
  }, [toVal]);

  useEffect(() => {
    if (!_isEmpty(tokenBalances)) {
      if (
        Number(toVal) > _get(tokenBalances, _get(offer, "receive.name", ""), 0)
      ) {
        setToErr("Insufficient balance");
      } else if (Number(fromVal) > Number(_get(offer, "sendAmount", 0))) {
        setToErr("Receive exceeds available amount");
      } else if (Number(toVal) < Number(_get(offer, "min", 0))) {
        setToErr(
          `Insufficient amount should be at least ${_get(offer, "min", 0)}`
        );
      } else {
        setToErr("");
      }
    }

    // eslint-disable-next-line
  }, [toVal, tokenBalances, fromVal]);

  if (isMobile) {
    return (
      <MobileCard title="Send">
        <div className="p-5 pt-0">
          <p className="bg-[#242429] p-4 rounded-lg text-[#B8ACFF] text-xs">
            The stables have been locked and will be release to each party after
            a price and an amount has been agreed on or when the order has been
            cancelled.
          </p>
        </div>
        <div className="bg-[#242429] rounded-t-3xl py-[30px] px-5 flex flex-col justify-between pb-[130px]">
          <div className="w-full">
            <ValueInput
              title="Amount"
              available={true}
              availableAmt={_get(
                tokenBalances,
                _get(offer, "receive.name", "")
              )}
              setValue={setToVal}
              value={toVal.toString()}
              token={_get(offer, "receive", {})}
              error={toErr}
            />

            <p className="text-[#B8ACFF] relative -top-5">{`1${_get(
              offer,
              "send.name",
              ""
            )} = ${_get(offer, "rate", 0)} ${_get(
              offer,
              "receive.name",
              ""
            )}`}</p>

            <ValueInput
              title="Receive"
              setValue={setFromVal}
              value={fromVal}
              disabledValue={true}
              token={_get(offer, "send", {})}
            />

            <div className="py-3 px-6 my-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm text-light-dark">Available</span>
                <span className="text-sm">{_get(offer, "sendAmount", 0)}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-light-dark">Limit</span>
                <span className="text-sm">{`${_get(offer, "min", 0)}-${_get(
                  offer,
                  "receiveAmount",
                  0
                )} ${_get(offer, "receive.name", "")}`}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full">
            <button
              className="text-center text-bold py-4 w-[150px] bg-transparent border-[2px] border-solid border-[#ffffff] rounded-lg cursor-pointer"
              onClick={() => navigate("/send")}
            >
              Cancel
            </button>
            <button
              className="text-center py-4 w-[150px] bg-[#5a4ee8] rounded-lg"
              onClick={() => processAcceptOffer()}
              disabled={!!toErr}
            >
              Release tokens
            </button>
          </div>

          <div className="flex justify-center items-center w-full mt-5">
            <div
              style={{ wordBreak: "break-all" }}
              dangerouslySetInnerHTML={{ __html: txStatus }}
            ></div>
          </div>
        </div>
      </MobileCard>
    );
  } else {
    return (
      <Card title="Send" back={() => navigate(-1)}>
        <div className="flex flex-col w-full">
          <div className="flex mb-8">
            <InfoIcon className="w-[30px]" />
            <p className="text-[#B8ACFF] text-xs ml-2">
              The stables have been locked and will be release to each party
              after a price and an amount has been agreed on or when the order
              has been cancelled.
            </p>
          </div>
          <ValueInput
            title="Amount"
            available={true}
            availableAmt={_get(tokenBalances, _get(offer, "receive.name", ""))}
            setValue={setToVal}
            value={toVal}
            token={_get(offer, "receive", {})}
            error={toErr}
          />
          <p className="bg-[#090912] rounded-lg py-1 px-6 text-[#B8ACFF] my-4">{`1 ${_get(
            offer,
            "send.name",
            ""
          )} = ${_get(offer, "rate", 0)} ${_get(
            offer,
            "receive.name",
            ""
          )}`}</p>
          <ValueInput
            title="Receive"
            disabledValue={true}
            setValue={setFromVal}
            value={fromVal}
            token={_get(offer, "send", {})}
          />
          <div className="bg-[#090912] rounded-lg py-3 px-6 mt-4 mb-10 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm text-light-dark">Available</span>
              <span className="text-sm">{_get(offer, "sendAmount")}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-light-dark">Limit</span>
              <span className="text-sm">{`${_get(offer, "min", 0)}-${_get(
                offer,
                "receiveAmount",
                0
              )} ${_get(offer, "receive.name", "")}`}</span>
            </div>
          </div>

          <div className="flex justify-between items-center w-full">
            <button
              className="text-center text-bold py-4 w-[150px] bg-transparent border-[2px] border-solid border-[#ffffff] rounded-lg cursor-pointer"
              onClick={() => navigate("/send")}
            >
              Cancel
            </button>
            <button
              className="text-center py-4 w-[150px] bg-[#5a4ee8] rounded-lg"
              onClick={() => processAcceptOffer()}
              disabled={!!toErr}
            >
              Continue
            </button>
          </div>

          <div className="flex justify-center items-center w-full mt-5">
            <div
              style={{ wordBreak: "break-all" }}
              dangerouslySetInnerHTML={{ __html: txStatus }}
            ></div>
          </div>
        </div>
      </Card>
    );
  }
};

export default TopUp;

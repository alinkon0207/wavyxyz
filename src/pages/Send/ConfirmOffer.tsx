import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import _get from "lodash/get";
import _find from "lodash/find";

// Icon
import { ReactComponent as EastIcon } from "assets/img/icon/arrow-right.svg";

// Component
import Card from "components/Card";
import MobileCard from "components/MobileCard";

import useConfig from "hooks/useConfig";
import { useAppSelector } from "hooks/useRedux";
import useWallet from "hooks/wallets";
import { ethers } from "ethers";
import { calculateNonDecimalValue, getTransactionUrl } from "utils/common";

const ConfirmOffer = () => {
  const navigate = useNavigate();

  const { tokenBalances, processAllowance, makeOffer } = useWallet();

  const network = useAppSelector((state) => state.network);
  const send = useAppSelector((state) => state.send);

  const [txStatus, setTxStatus] = useState<string>("");

  const { isMobile } = useConfig();

  const offerData = useMemo(() => {
    if (network.token) {
      return {
        send: _find(network.token, ["idx", send.sIdx]) || {},
        receive: _find(network.token, ["idx", send.rIdx]) || {},
      };
    }
  }, [network.token, send]);

  const processSend = async () => {
    try {
      const contractAddress = _get(offerData.send, "contract.address", "");
      const contractDecimals = _get(offerData.send, "contract.decimals", 6);
      const rcontractDecimals = _get(offerData.receive, "contract.decimals", 6);

      if (typeof processAllowance === "function") {
        const sendAmount = (
          (Number(send.sAmount) || 0) +
          ((Number(send.sAmount) || 0) * 0.25) / 100
        ).toFixed(contractDecimals);

        setTxStatus("Confirm Allowance Transaction on wallet.");

        const { hash: hashAllowance, wait: waitAllowance } =
          await processAllowance(
            contractAddress,
            calculateNonDecimalValue(
              network.sub,
              Number(sendAmount),
              contractDecimals
            )
          );
        setTxStatus(
          `Processing allowance, <a target="_blank" href="${getTransactionUrl(
            network.chainId,
            network.explorerUrl,
            hashAllowance
          )}"><u>Check here.</u></>`
        );

        await waitAllowance;

        setTxStatus("Allowance Processed.");
      }

      setTxStatus("Confirm Transaction on wallet.");

      const { hash: hashOffer, wait: waitOffer } = await makeOffer({
        sId: send.sIdx,
        sAmt: calculateNonDecimalValue(
          network.sub,
          Number(send.sAmount),
          contractDecimals
        ),
        rId: send.rIdx,
        rAmt: calculateNonDecimalValue(
          network.sub,
          Number(send.rAmount),
          rcontractDecimals
        ),
        min: calculateNonDecimalValue(network.sub, send.min, rcontractDecimals),
      });

      setTxStatus(
        `Creating Offer, <a target="_blank" href="${getTransactionUrl(
          network.chainId,
          network.explorerUrl,
          hashOffer
        )}"><u>Check here.</u></a>`
      );

      await waitOffer;

      await setTimeout(function () {
        setTxStatus("Offer created successfully.");
      }, 1000);

      setTimeout(function () {
        navigate("/send/offers");
      }, 2000);
    } catch (error: any) {
      setTxStatus(error?.shortMessage || error?.message);
    }
  };

  if (isMobile) {
    return (
      <MobileCard title="Confirm offer" back={() => navigate("/send")}>
        <div className="px-5">
          <div className="w-full flex items-center justify-around mb-11">
            <div className="flex flex-col items-center">
              <img
                src={
                  offerData.send.icon
                    ? offerData.send.icon
                    : `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${_get(
                        offerData,
                        "send.name",
                        ""
                      )}`
                }
                alt="token"
                className="w-[60px] h-[60px] mb-3 rounded-full"
              />
              <p className="text-xs mb-2">From</p>
              <p className="text-base font-Unbounded font-bold">
                {offerData.send.name}
              </p>
            </div>
            <EastIcon />
            <div className="flex flex-col items-center">
              <img
                src={
                  offerData.receive.icon
                    ? offerData.receive.icon
                    : `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${_get(
                        offerData,
                        "receive.name",
                        ""
                      )}`
                }
                alt="token"
                className="w-[60px] h-[60px]  mb-3 rounded-full"
              />
              <p className="text-xs mb-2">Receive</p>
              <p className="text-base font-Unbounded font-bold">
                {offerData.receive.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full rounded-lg px-5 py-6 bg-[#242429]">
            <div className="flex w-full items-center justify-between mb-2 text-sm">
              <p>Send currency</p>{" "}
              <p>
                {" "}
                {send.sAmount} {offerData.send.name}
              </p>
            </div>
            <div className="flex w-full items-center justify-between my-2 text-sm">
              <p>Receive currency</p>{" "}
              <p>
                {send.rAmount} {offerData.receive.name}
              </p>
            </div>
            <div className="flex w-full items-center justify-between my-2 text-sm">
              <p>Exchange rate</p>{" "}
              <p>{`1 ${offerData.send.name} = ${send.rate} ${offerData.receive.name}`}</p>
            </div>
            <div className="flex w-full items-center justify-between my-2 text-sm">
              <p>Limit</p>{" "}
              <p>{`${send.min} - ${send.max} ${offerData.receive.name}`}</p>
            </div>
            <div className="flex w-full items-center justify-between text-sm">
              <p>Available</p>{" "}
              <p>{`${tokenBalances[offerData.send.name] || 0} ${
                offerData.send.name
              }`}</p>
            </div>
          </div>
          <div className="flex justify-between items-center w-full mt-20">
            <button
              className="text-center text-bold py-4 w-[150px] bg-transparent border-[2px] border-solid border-[#ffffff] rounded-lg cursor-pointer"
              onClick={() => navigate("/send/create-offer")}
            >
              Back
            </button>
            <button
              className="text-center py-4 w-[150px] bg-[#5a4ee8] rounded-lg cursor-pointer"
              onClick={() => processSend()}
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
      </MobileCard>
    );
  } else {
    return (
      <Card title="Confirm offer">
        <div className="w-full flex items-center justify-around mb-8">
          <div className="flex flex-col items-center">
            <img
              src={
                offerData.send.icon
                  ? offerData.send.icon
                  : `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${_get(
                      offerData,
                      "send.name",
                      ""
                    )}`
              }
              alt="token"
              className="w-[60px] h-[60px] mb-3 rounded-full"
            />
            <p className="text-xs mb-2">From</p>
            <p className="text-base font-Unbounded font-bold">
              {offerData.send.name}
            </p>
          </div>
          <EastIcon />
          <div className="flex flex-col items-center">
            <img
              src={
                offerData.receive.icon
                  ? offerData.receive.icon
                  : `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${_get(
                      offerData,
                      "receive.name",
                      ""
                    )}`
              }
              alt="token"
              className="w-[60px] h-[60px]  mb-3 rounded-full"
            />
            <p className="text-xs mb-2">Receive</p>
            <p className="text-base font-Unbounded font-bold">
              {offerData.receive.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full rounded-lg border-[0.6px] px-5 py-4 border-[#ACACAE}]">
          <div className="flex w-full items-center justify-between mb-5 text-sm">
            <p>Send currency</p>{" "}
            <p>
              {send.sAmount} {offerData.send.name}
            </p>
          </div>
          <div className="flex w-full items-center justify-between mb-5 text-sm">
            <p>Receive currency</p>{" "}
            <p>
              {send.rAmount} {offerData.receive.name}
            </p>
          </div>
          <div className="flex w-full items-center justify-between mb-5 text-sm">
            <p>Exchange rate</p>{" "}
            <p>{`1 ${offerData.send.name} = ${send.rate} ${offerData.receive.name}`}</p>
          </div>
          <div className="flex w-full items-center justify-between mb-5 text-sm">
            <p>Limit</p>{" "}
            <p>{`${send.min} - ${send.max} ${offerData.receive.name}`}</p>
          </div>
          <div className="flex w-full items-center justify-between text-sm">
            <p>Available</p>{" "}
            <p>{`${tokenBalances[offerData.send.name] || 0} ${
              offerData.send.name
            }`}</p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full mt-10">
          <button
            className="text-center text-bold py-4 w-[150px] bg-transparent border-[2px] border-solid border-[#ffffff] rounded-lg cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="text-center py-4 w-[150px] bg-[#5a4ee8] rounded-lg cursor-pointer"
            onClick={() => processSend()}
          >
            Continue
          </button>
        </div>
        <br />
        <div className="flex justify-center items-center w-full mt-5">
          <div
            style={{ wordBreak: "break-all" }}
            dangerouslySetInnerHTML={{ __html: txStatus }}
          ></div>
        </div>
      </Card>
    );
  }
};

export default ConfirmOffer;

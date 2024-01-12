import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _get from "lodash/get";

// component
import Card from "components/Card";
import MobileCard from "components/MobileCard";
import ValueInput from "components/ValueInput";

// Constatn
import useConfig from "hooks/useConfig";
import { useAppSelector } from "hooks/useRedux";
import { getOffer } from "services/firebase";
import useWallet from "hooks/wallets";
import { calculateNonDecimalValue, getTransactionUrl } from "utils/common";

const EditOffer = () => {
  const navigate = useNavigate();

  const network = useAppSelector((state) => state.network);

  const { isMobile } = useConfig();

  const { idx } = useParams();

  const { updateOffer } = useWallet();

  const [offer, setOffer] = useState({});
  const [txStatus, setTxStatus] = useState("");
  const [rError, setRError] = useState("");

  const fetchOffer = async () => {
    const _idx = isNaN(Number(idx)) ? idx : Number(idx);
    const _offer = await getOffer(network.chainId, _idx);

    setOffer(_offer);
  };

  const [min, setMin] = useState(_get(offer, "min", 0));
  const [receiveAmount, setReceiveAmount] = useState(
    _get(offer, "receiveAmount", 0)
  );
  const [rate, setRate] = useState(_get(offer, "rate", 0));

  const handleRate = (e: any) => {
    setRate(e.target.value);
    const _rate = Number(e.target.value) || 0;

    const sAmount = Number(_get(offer, "sendAmount", "0"));

    setReceiveAmount(
      (sAmount * _rate).toFixed(_get(offer, "receive.decimals", 0))
    );
  };

  const handleRAmount = (value) => {
    setReceiveAmount(value);
    const sAmount = Number(_get(offer, "sendAmount", "0"));

    setRate((Number(value) / sAmount).toFixed(2));
  };

  const handleUpdate = async () => {
    try {
      const rcontractDecimals = _get(offer, "receive.decimals", 6);

      const rAmt = calculateNonDecimalValue(
        network.sub,
        receiveAmount,
        rcontractDecimals
      );

      const _min = calculateNonDecimalValue(
        network.sub,
        min,
        rcontractDecimals
      );

      setTxStatus("Confirm Transaction on wallet.");

      const { hash, wait } = await updateOffer(
        _get(offer, "offerId", 0),
        rAmt,
        _min
      );

      setTxStatus(
        `Updating offer, <a target="_blank" href="${getTransactionUrl(
          network.chainId,
          network.explorerUrl,
          hash
        )}"><u>Check here.</u></>`
      );

      if (wait) {
        try {
          await wait;
        } catch (e: any) {
          console.log("ee", e);
        }
      }

      setTimeout(() => {
        setTxStatus("Offer Updated.");
      }, 1000);

      setTimeout(() => {
        navigate("/send/offers");
      }, 1000);
    } catch (error: any) {
      console.log(error);
      setTxStatus(error?.shortMessage || error?.message);
    }
  };

  useEffect(() => {
    setRate(_get(offer, "rate", 0));
    setMin(_get(offer, "min", 0));
    setReceiveAmount(_get(offer, "receiveAmount", 0));
  }, [offer]);

  useEffect(() => {
    fetchOffer();

    // eslint-disable-next-line
  }, [idx]);

  useEffect(() => {
    setRError(
      Number(receiveAmount) && Number(receiveAmount) < Number(min)
        ? "Must be at least min amount"
        : ""
    );
  }, [receiveAmount, min]);

  if (isMobile) {
    return (
      <MobileCard title="Edit offer" back={() => navigate("/send/offers")}>
        <div className="bg-[#242429] rounded-t-3xl py-[30px] px-5 flex flex-col items-center justify-center w-full">
          <div className="w-full h-full pb-[100px]">
            <div className="mr-2">
              <ValueInput
                title="Send"
                available={true}
                value={_get(offer, "sendAmount", 0)}
                token={_get(offer, "send", {})}
                setValue={() => {}}
                disable={true}
              />
            </div>
            <div className="relative">
              <ValueInput
                title="Receive"
                value={receiveAmount}
                setValue={handleRAmount}
                token={_get(offer, "receive", {})}
                error={rError}
              />
            </div>
            <div>
              <p className="text-sm text-light-dark">Exchange rate</p>
              <div className="flex items-center">
                <p className="text-2xl">{`1 ${_get(
                  offer,
                  "receive.name",
                  ""
                )} =`}</p>
                <div
                  className="flex rounded-lg border-[0.6px] px-5 py-3 ml-10 w-3/5"
                  style={{ borderColor: "#ACACAE" }}
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
                      src={_get(
                        offer,
                        "receive.icon",
                        `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${_get(
                          offer,
                          "receive.name",
                          ""
                        )}`
                      )}
                      alt="token"
                      className="w-[24px] h-[24px]"
                    />
                    <span className="text-base mx-2">
                      {_get(offer, "receive.name", "")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-5  w-full">
              <p className="text-2xl mb-2">Set order limit</p>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col w-1/2">
                  <span className="text-sm text-light-dark mb-3">{`Min. order (${_get(
                    offer,
                    "receive.name",
                    ""
                  )})`}</span>
                  <div className="rounded-lg border-[0.6px] px-5 py-2 border-[#ACACAE}] ">
                    <input
                      lang="en"
                      type="number"
                      className="w-full p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
                      value={min}
                      onChange={(e: any) => setMin(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-3xl mx-5">-</div>

                <div className="flex flex-col w-1/2">
                  <span className="text-sm text-light-dark mb-3">{`Max. order (${_get(
                    offer,
                    "receive.name",
                    ""
                  )})`}</span>
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
              className="text-center mt-10 py-4 w-full bg-[#5a4ee8] rounded-lg cursor-pointer"
              onClick={() => handleUpdate()}
            >
              Confirm offer details
            </button>
            <div className="flex justify-center items-center w-full mt-5">
              <div
                style={{ wordBreak: "break-all" }}
                dangerouslySetInnerHTML={{ __html: txStatus }}
              ></div>
            </div>
          </div>
        </div>
      </MobileCard>
    );
  } else {
    return (
      <Card title="Edit offer" back={() => navigate("/send")} lg={650}>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-10">
            <div className="relative mr-2">
              <ValueInput
                title="Send"
                available={true}
                value={_get(offer, "sendAmount", 0)}
                token={_get(offer, "send", {})}
                setValue={() => {}}
                disable={true}
              />
              <div className="absolute w-full h-full top-0 left-0 bg-[#00000082]" />
            </div>
            <div className="relative">
              <ValueInput
                title="Receive"
                value={receiveAmount}
                setValue={handleRAmount}
                token={_get(offer, "receive", {})}
                error={rError}
              />
            </div>
          </div>
          <div>
            <p className="text-sm">Exchange rate</p>
            <div className="flex items-center">
              <p className="text-2xl">{`1 ${_get(
                offer,
                "send.name",
                ""
              )} =`}</p>
              <div
                className="flex rounded-lg border-[0.6px] px-5 py-2 border-[#ACACAE}] ml-10"
                style={{ borderColor: "#ACACAE" }}
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
                    src={_get(
                      offer,
                      "receive.icon",
                      `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${_get(
                        offer,
                        "receive.name",
                        ""
                      )}`
                    )}
                    alt="token"
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-base mx-2">
                    {_get(offer, "receive.name", "")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="my-5">
            <p className="text-2xl mb-2">Set order limit</p>
            <div className="flex items-center">
              <div className="flex flex-col rounded-lg border-[0.6px] px-5 py-2 border-[#ACACAE}] w-[35%] ">
                <span className="text-sm">{`Min. order (${_get(
                  offer,
                  "receive.name",
                  ""
                )})`}</span>
                <input
                  lang="en"
                  type="number"
                  className="p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
                  value={min}
                  onChange={(e: any) => setMin(e.target.value)}
                />
              </div>
              <div className="text-3xl mx-5">-</div>
              <div className="flex flex-col rounded-lg border-[0.6px] px-5 py-2 border-[#ACACAE}] w-[35%] ">
                <span className="text-sm">{`Max. order (${_get(
                  offer,
                  "receive.name",
                  ""
                )})`}</span>
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
              onClick={() => handleUpdate()}
              disabled={!receiveAmount || rError !== ""}
            >
              Confirm offer details
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

export default EditOffer;

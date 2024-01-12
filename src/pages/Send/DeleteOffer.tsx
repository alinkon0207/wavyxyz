import { ReactComponent as EastIcon } from "assets/img/icon/arrow-right.svg";
import { ReactComponent as InfoIcon } from "assets/img/icon/info.svg";

import Card from "components/Card";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "hooks/useRedux";
import { getOffer } from "services/firebase";
import { useEffect, useState } from "react";
import _get from "lodash/get";
import useWallet from "hooks/wallets";
import { getTransactionUrl } from "utils/common";

const ConfirmOffer = () => {
  const navigate = useNavigate();
  const network = useAppSelector((state) => state.network);
  const { idx } = useParams();

  const { cancelOffer } = useWallet();

  const [offer, setOffer] = useState({});
  const [txStatus, setTxStatus] = useState("");

  const fetchOffer = async () => {
    const _idx = isNaN(Number(idx)) ? idx : Number(idx);
    const _offer = await getOffer(network.chainId, _idx);
    setOffer(_offer);
  };

  const deleteOffer = async () => {
    try {
      setTxStatus("Confirm Transaction on wallet.");

      const { hash, wait } = await cancelOffer(idx);

      setTxStatus(
        `Deleting Offer, <a target="_blank" href="${getTransactionUrl(
          network.chainId,
          network.explorerUrl,
          hash
        )}"><u>Check here.</u></a>`
      );

      await wait;

      navigate("/send/delete-success");
    } catch (error: any) {
      setTxStatus(error?.shortMessage || error?.message);
    }
  };

  useEffect(() => {
    fetchOffer();

    // eslint-disable-next-line
  }, [idx]);

  return (
    <Card title="Confirm Offer Delete">
      <div className="w-full flex items-center justify-around mb-8">
        <div className="flex flex-col items-center">
          <img
            src={_get(
              offer,
              "send.icon",
              `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${_get(
                offer,
                "send.name",
                ""
              )}`
            )}
            alt="token"
            className="w-[60px] h-[60px] mb-3 rounded-full"
          />
          <p className="text-sm mb-2">From</p>
          <p className="text-base font-bold font-Unbounded">
            {_get(offer, "send.name", "")}
          </p>
        </div>
        <EastIcon />
        <div className="flex flex-col items-center">
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
            className="w-[60px] h-[60px]  mb-3 rounded-full"
          />
          <p className="text-sm mb-2">Receive</p>
          <p className="text-base font-bold font-Unbounded">
            {_get(offer, "receive.name", "")}
          </p>
        </div>
      </div>
      <div className="flex">
        <InfoIcon className="w-[30px]" />
        <p className="text-[#B8ACFF] text-xs ml-2">
          Confirm that you want to delete this offer. The locked stablecoin
          amount for this offer will be returned to your wallet address.
        </p>
      </div>
      <div className="flex justify-between items-center w-full mt-20">
        <button
          className="text-center text-bold py-4 w-[150px] bg-transparent border-[2px] border-solid border-[#ffffff] rounded-lg cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="text-center py-4 w-[150px] bg-[#5a4ee8] rounded-lg cursor-pointer"
          onClick={() => deleteOffer()}
        >
          Confirm
        </button>
      </div>
      <div className="flex justify-center items-center w-full mt-5">
        <div
          style={{ wordBreak: "break-all" }}
          dangerouslySetInnerHTML={{ __html: txStatus }}
        ></div>
      </div>
    </Card>
  );
};

export default ConfirmOffer;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Icon
import { ReactComponent as BackIcon } from "assets/img/icon/arrow_back.svg";
import { ReactComponent as EastIcon } from "assets/img/icon/arrow-right.svg";
import { ReactComponent as MoreIcon } from "assets/img/icon/more.svg";

// Styled
import MenuList from "components/MenuList";
import { MY_OFFER_ACTION } from "config/constants/demo";
import useConfig from "hooks/useConfig";
import MobileCard from "components/MobileCard";
import MobileList from "components/MobileList";
import MobileDeleteOffer from "components/MobileDeleteOffer";
import { useAppSelector } from "hooks/useRedux";
import { myOffers } from "services/firebase";
import useWallet from "hooks/wallets";

const Send = () => {
  const navigate = useNavigate();
  const { isMobile } = useConfig();
  const network = useAppSelector((state) => state.network);

  const { selectedAccount } = useWallet();

  const [anchor, setAnchor] = useState<boolean>(false);
  const [index, setIndex] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  const [offers, setOffers] = useState([]);

  const anchorHandle = (event: any, i: number) => {
    setAnchor(true);
    setIndex(i);
  };

  const handleClose = (e: any) => {
    e.preventDefault();
    setAnchor(false);
    setIndex(0);
  };

  const callBack = (i: number) => {
    if (!i) {
      navigate(`/send/edit-offer/${index}`);
    } else {
      if (isMobile) {
        setDeleteModal(true);
      } else {
        navigate(`/send/delete-offer/${index}`);
      }
    }
    setAnchor(false);
  };

  const fetchOffers = async () => {
    const offers = await myOffers(network.chainId, selectedAccount);

    // eslint-disable-next-line
    setOffers(offers);
  };

  useEffect(() => {
    fetchOffers();

    // eslint-disable-next-line
  }, [network.chainId, selectedAccount]);

  if (isMobile) {
    return (
      <MobileCard title="My offers" back={() => navigate("/send")}>
        <div className="bg-[#242429] rounded-t-3xl py-[30px] px-5">
          <div>
            {offers.map((one: any, i: number) => (
              <div
                key={i}
                className="w-full grid mb-4 border-light-dark border-[0.6px] px-5 py-6 rounded-lg flex flex-col"
              >
                <div className="flex  justify-between">
                  <div className="flex flex-col w-1/2">
                    <p className="text-xs">You send</p>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center cursor-pointer mt-1 mb-2">
                        <img
                          src={
                            one.send.icon
                              ? one.send.icon
                              : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                                one.send.name
                          }
                          alt="token"
                          className="w-[24px] h-[24px] rounded-full"
                        />
                        <span className="text-base ml-2">{one.send.name}</span>
                      </div>
                      <EastIcon className="mr-8" />
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2 relative">
                    {Number(one.status) === 0 && (
                      <div
                        onClick={(e: any) => anchorHandle(e, one.offerId)}
                        className="absolute flex items-center justify-center cursor-pointer w-[30px] h-[30px] border-light-dark border-[0.6px] rounded-full top-0 right-0"
                      >
                        <MoreIcon />
                      </div>
                    )}
                    <p className="text-xs">You receive</p>
                    <div className="flex items-center cursor-pointer mt-1 mb-2">
                      <img
                        src={
                          one.receive.icon
                            ? one.receive.icon
                            : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                              one.receive.name
                        }
                        alt="token"
                        className="w-[24px] h-[24px] rounded-full"
                      />
                      <span className="text-base ml-2">{one.receive.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between w-full">
                  <div>
                    <p className="text-xs text-light-dark">Exchange rate</p>
                    <p className="text-sm">
                      {" "}
                      1 {one.send.name} = {one.rate} {one.receive.name}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-xs text-light-dark">limit</p>
                    <p className="text-sm">
                      {one.min}-{one.receiveAmount} {one.receive.name}
                    </p>
                  </div>
                  <div className="line-flex self-end text-[#242429] font-bold ">
                    {(() => {
                      switch (Number(one.status)) {
                        case 0:
                          return (
                            <div className="inline-flex py-1 px-2 items-center text-xs cursor-pointer rounded-full bg-[#B8ACFF]">
                              Active
                            </div>
                          );
                        case 1:
                          return (
                            <div className="inline-flex py-1 px-2 items-center text-xs cursor-pointer rounded-full bg-[#FCEB06]">
                              Completed
                            </div>
                          );
                        case 2:
                          return (
                            <div className="inline-flex py-1 px-2 items-center text-xs cursor-pointer rounded-full bg-[#FE7F83]">
                              Cancelled
                            </div>
                          );
                      }
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[200px]" />
        </div>
        <div className="flex w-full fixed items-center justify-between bottom-0 px-5 pt-6 pb-12 bg-[#151518] rounded-t-3xl">
          <button
            className="px-3 text-center py-4 min-w-[150px] text-sm w-full bg-[#5a4ee8] rounded-lg cursor-pointer"
            onClick={() => navigate("/send/create-offer")}
          >
            Create a new offer
          </button>
        </div>
        {Boolean(anchor) && (
          <MobileList
            data={MY_OFFER_ACTION}
            close={handleClose}
            callback={callBack}
            notClose={true}
            anchor={anchor}
          />
        )}
        {deleteModal && (
          <MobileDeleteOffer idx={index} close={() => setDeleteModal(false)} />
        )}
      </MobileCard>
    );
  } else {
    return (
      <div className="card py-7 min-h-[500px] w-[650px]">
        <div className="flex items-center justify-center relative mb-10 mx-[24px]">
          <div
            onClick={() => navigate("/send")}
            className="absolute left-0 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
          >
            <BackIcon className="h-7 w-7" />
          </div>

          <h2 className="text-center text-2xl font-bold font-Unbounded ">
            My Offers
          </h2>
        </div>
        <div className="flex flex-col min-h-[400px] justify-between">
          <div className="flex flex-col items-center h-full px-[64px]">
            {offers.map((one: any, i: number) => (
              <div
                key={i}
                className="bg-[#19181F] w-full grid mt-4 border-light-dark border-[0.6px] px-3 py-2 rounded-lg grid-cols-3"
              >
                <div className="flex flex-col">
                  <p className="text-xs">You send</p>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center cursor-pointer mt-1 mb-2">
                      <img
                        src={
                          one.send.icon
                            ? one.send.icon
                            : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                              one.send.name
                        }
                        alt="token"
                        className="w-[24px] h-[24px] rounded-full"
                      />
                      <span className="text-base ml-2">{one.send.name}</span>
                    </div>
                    <EastIcon />
                  </div>
                  <div>
                    <p className="text-xs text-light-dark">Exchange rate</p>
                    <p className="text-sm">
                      1 {one.send.name} = {one.rate} {one.receive.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col mx-auto">
                  <p className="text-xs">You receive</p>
                  <div className="flex items-center cursor-pointer mt-1 mb-2">
                    <img
                      src={
                        one.receive.icon
                          ? one.receive.icon
                          : "https://dummyimage.com/50x50/2E2E4D/ffffff&text=" +
                            one.receive.name
                      }
                      alt="token"
                      className="w-[24px] h-[24px] rounded-full"
                    />
                    <span className="text-base ml-2">{one.receive.name}</span>
                  </div>
                  <div>
                    <p className="text-xs text-light-dark">Available</p>
                    <p className="text-sm">
                      {one.sendAmount} {one.send.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-end relative">
                  {Number(one.status) === 0 && (
                    <div className="absolute flex items-center justify-center cursor-pointer w-[30px] h-[30px] border-light-dark border-[0.6px] rounded-full top-0 right-0">
                      <div
                        className="px-3"
                        onClick={(e: any) => anchorHandle(e, one.offerId)}
                      >
                        <MoreIcon />
                      </div>

                      {index === one.offerId && anchor && (
                        <div className="relative">
                          <MenuList
                            top={20}
                            left={-20}
                            minWidth={160}
                            data={MY_OFFER_ACTION}
                            anchor={anchor}
                            close={handleClose}
                            callback={callBack}
                            size={24}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs"></p>
                  <div className="line-flex text-[#242429] font-bold">
                    {(() => {
                      switch (Number(one.status)) {
                        case 0:
                          return (
                            <div className="inline-flex py-2 px-2 items-center text-xs cursor-pointer mt-1 mb-2 rounded-full bg-[#B8ACFF]">
                              Active
                            </div>
                          );
                        case 1:
                          return (
                            <div className="inline-flex py-2 px-2 items-center text-xs cursor-pointer mt-1 mb-2 rounded-full bg-[#07E58A]">
                              Completed
                            </div>
                          );
                        case 2:
                          return (
                            <div className="inline-flex py-2 px-2 items-center text-xs cursor-pointer mt-1 mb-2 rounded-full bg-[#FE7F83]">
                              Cancelled
                            </div>
                          );
                      }
                    })()}
                  </div>
                  <div>
                    <p className="text-xs text-light-dark">limit</p>
                    <p className="text-sm">
                      {one.min}-{one.receiveAmount} {one.receive.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-5">
            <button
              className="text-center py-4 w-[60%] bg-[#5a4ee8] rounded-lg cursor-pointer"
              onClick={() => navigate("/send/create-offer")}
            >
              Create a new offer
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Send;

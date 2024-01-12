import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Dialog from "components/Dialog";

// Icon
import { ReactComponent as CloseIcon } from "assets/img/icon/close.svg";
import { ReactComponent as SuccessIcon } from "assets/img/icon/success.svg";
import { ReactComponent as BackIcon } from "../assets/img/icon/arrow_back.svg";

import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { addToken, getTokensByChain, removeToken } from "services/firebase";
import useWallet from "hooks/wallets";
import { getTransactionUrl } from "utils/common";
import network, { fetchTokensByChainID } from "redux/network";

const Dashboard = () => {
  const navigate = useNavigate();
  const selectedNet = useAppSelector((state) => state.network);

  const { removeFromAllowList, addToAllowList, tranferOwnerShip } = useWallet();
  const [ownerAddress, setOwnerAddress] = useState("");

  const [open, setOpen] = useState(false);
  const [delopen, setDelOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [addData, setAddData] = useState({
    address: "",
    symbol: "",
    decimals: "",
  });

  const [tokens, setTokens] = useState([]);
  const [delToken, setDelToken] = useState({
    name: "",
    icon: "",
    sub: "",
    idx: "",
    address: "",
  });

  const dispatch = useAppDispatch();

  const prepareTokens = async (chainId) => {
    let tokens = [];

    if (chainId) {
      tokens = await getTokensByChain(chainId);
    }

    setTokens(tokens);
    dispatch(fetchTokensByChainID(selectedNet?.chainId || 0));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const delHandleClose = () => {
    setDelOpen(false);
  };

  const delHandleOpen = (one: any) => {
    setDelOpen(true);
    setDelToken(one);
    setStatusMsg("");
  };

  const endHandleClose = () => {
    setStatusMsg("");
    setAddData({
      address: "",
      symbol: "",
      decimals: "",
    });
    setEndOpen(0);
  };

  const endHandleOpen = (i: number) => {
    setEndOpen(i);
    delHandleClose();
    handleClose();
  };

  const removeStable = async () => {
    try {
      setStatusMsg("Pleaase confirm transaction on wallet");

      try {
        const { hash, wait } = await removeFromAllowList(
          delToken.idx,
          selectedNet?.chainId
        );

        setStatusMsg(
          `Removing stable, <a target="_blank" href="${getTransactionUrl(
            selectedNet?.chainId,
            selectedNet.explorerUrl,
            hash
          )}"><u>Check here.</u></a>`
        );

        await wait;
      } catch (error: any) {
        const msg = error.shortMessage || error.message || "";

        if (
          msg.search("token already disabled") === -1 &&
          selectedNet?.chainId != 169
        ) {
          throw error;
        }
      }

      await removeToken(`${selectedNet?.chainId}-${delToken.idx}`);

      setStatusMsg("Stable Removed!");

      prepareTokens(selectedNet?.chainId);

      endHandleOpen(2);
    } catch (error: any) {
      setStatusMsg(error.shortMessage || error.message || "");
    }
  };

  const addAllowListOnDB = async () => {
    setStatusMsg("Creating new Stable!");

    await addToken(
      selectedNet?.chainId,
      addData.address,
      addData.symbol,
      addData.address,
      Number(addData.decimals)
    );

    setStatusMsg("Stable Added!");

    await prepareTokens(selectedNet?.chainId);

    endHandleOpen(1);
  };

  const addAllowListOnChain = async () => {
    try {
      setStatusMsg("Pleaase confirm transaction on wallet");

      const { hash, wait } = await addToAllowList(
        addData.address,
        addData.symbol,
        addData.decimals,
        selectedNet?.chainId
      );

      setStatusMsg(
        `Adding stable, <a target="_blank" href="${getTransactionUrl(
          selectedNet?.chainId,
          selectedNet.explorerUrl,
          hash
        )}"><u>Check here.</u></a>`
      );

      await wait;

      setStatusMsg("Stable Added!");

      await prepareTokens(selectedNet?.chainId);

      endHandleOpen(1);
    } catch (error: any) {
      setStatusMsg(error.message || "");
    }
  };

  const addAllowList = async () => {
    if (selectedNet?.chainId === 169) {
      await addAllowListOnDB();
    } else {
      await addAllowListOnChain();
    }
  };

  useEffect(() => {
    prepareTokens(selectedNet?.chainId);
  }, [selectedNet]);

  const _tranferOwnerShip = async () => {
    try {
      const { hash } = await tranferOwnerShip(ownerAddress);
      setStatusMsg(hash);
    } catch (error: any) {
      console.log("error", error);
      setStatusMsg(error.message || "");
    }
  };

  return (
    <>
      <div className="card p-8 min-w-[760px]">
        <div className="flex items-center justify-between relative mb-10 mx-[24px]">
          <div
            onClick={() => navigate(-1)}
            className="absolute -left-10 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
          >
            <BackIcon className="h-6 w-6" />
          </div>
          <div className="flex items-center">
            <img
              src={selectedNet.icon}
              alt="logo"
              className="rounded-full bg-white h-[30px] w-[30px] mr-2"
            />
            <h1 className="text-3xl font-bold font-Unbounded">{`${selectedNet.sub} Stables`}</h1>
          </div>
          <button
            onClick={handleOpen}
            className="px-6 py-3 rounded-md bg-primary text-xs"
          >
            Add Stables
          </button>
        </div>
        <div className="px-5 mb-5">
          <div className="grid grid-cols-3 gap-4 mt-10">
            {tokens
              .filter(({ isAllowed }) => isAllowed === true)
              .map(({ name, sub, icon, idx, contract: { address } }: any) => (
                <div
                  key={idx}
                  onClick={() =>
                    delHandleOpen({ name, sub, icon, idx, address })
                  }
                  className="min-w-[30%] flex w-full cursor-pointer items-center justify-between rounded-lg border-[0.6px] border-[#ACACAE] py-4 px-5"
                >
                  <div className="flex items-center">
                    <div className="h-[36px] w-[36px] rounded-full bg-white flex items-center justify-center">
                      <img
                        src={
                          icon
                            ? icon
                            : `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${name}`
                        }
                        alt="logo"
                        className="rounded-full bg-white h-[30px] w-[30px] "
                      />
                    </div>
                    <div>
                      <p className="text-base ml-2">{name}</p>
                      <p className="text-xs ml-2 text-light-dark">{sub}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {selectedNet?.sub === "Solana" && (
            <div className="tmp my-5">
              <input
                type="text"
                className="text-black w-[500px]"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Enter Address"
              />
              <button
                className="bg-white text-black px-2 ml-2"
                onClick={() => _tranferOwnerShip()}
              >
                Transfer Ownership
              </button>
              <br />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className="flex items-center justify-center relative mb-10 mt-3 mx-[24px]">
          <div
            onClick={handleClose}
            className="absolute -right-5 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
          >
            <CloseIcon className="h-4 w-4" />
          </div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold font-Unbounded">
              {`${selectedNet.sub} Stables`}
            </h1>
          </div>
        </div>
        <div className="w-full px-10 mb-[30px]">
          <div>
            <p className="text-xs mb-1">Token Contract Address</p>
            <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-4 px-5 mb-8">
              <input
                className="w-full bg-transparent text-lg"
                placeholder="Token Contract Address"
                value={addData.address}
                onChange={(e) =>
                  setAddData({ ...addData, address: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <p className="text-xs mb-1">Token Symbol</p>
            <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-4 px-5 mb-8">
              <input
                className="w-full bg-transparent text-lg"
                placeholder="Token Symbol"
                value={addData.symbol}
                onChange={(e) =>
                  setAddData({ ...addData, symbol: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <p className="text-xs mb-1">Token Decimal</p>
            <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-4 px-5">
              <input
                className="w-full bg-transparent text-lg"
                placeholder="Token Decimal"
                defaultValue={0}
                type="text"
                value={addData.decimals}
                onChange={(e) =>
                  setAddData({ ...addData, decimals: e.target.value })
                }
              />
            </div>
          </div>
          <button
            disabled={
              (selectedNet.sub !== "Solana" &&
                (!addData.address ||
                  !addData.symbol ||
                  !Number(addData.decimals))) ||
              (selectedNet.sub === "Solana" && !addData.address)
            }
            onClick={() => addAllowList()}
            className="w-full mt-[65px] py-4 bg-[#5a4ee8] rounded-lg"
          >
            Add Stables
          </button>
          <div className="flex justify-center items-center mt-5">
            <div
              style={{ wordBreak: "break-all" }}
              dangerouslySetInnerHTML={{ __html: statusMsg }}
            ></div>
          </div>
        </div>
      </Dialog>
      <Dialog open={delopen} onClose={delHandleClose}>
        <div className="flex items-center justify-center relative mb-10 mt-3 mx-[24px]">
          <div
            onClick={delHandleClose}
            className="absolute -right-5 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
          >
            <CloseIcon className="h-4 w-4" />
          </div>
          <div className="flex items-center">
            <img
              src={delToken.icon}
              alt="logo"
              className="rounded-full bg-white h-[40px] w-[40px] mr-2"
            />
            <h1 className="text-3xl font-bold font-Unbounded">
              {delToken.name}
            </h1>
          </div>
        </div>
        <div className="w-full px-10 mb-[30px]">
          <div className="mb-7">
            <p className="text-xs mb-1">Asset Code</p>
            <p className="text-sm text-light-dark">{delToken.name}</p>
          </div>
          <div className="mb-7">
            <p className="text-xs mb-1">Currency</p>
            <p className="text-sm text-light-dark">{delToken.sub}</p>
          </div>
          <div className="mb-7">
            <p className="text-xs mb-1">Address</p>
            <p className="text-sm text-light-dark break-words">
              {delToken.address}
            </p>
          </div>
          <button
            onClick={() => removeStable()}
            className="w-full mt-[40px] py-4 bg-[#FFFFFF] rounded-lg text-[#151518] cursor-pointer"
          >
            <span className="text-red-700">Remove Stable</span>
          </button>
          <div className="flex justify-center items-center mt-5">
            <div
              style={{ wordBreak: "break-all" }}
              dangerouslySetInnerHTML={{ __html: statusMsg }}
            ></div>
          </div>
        </div>
      </Dialog>
      <Dialog open={Boolean(endOpen)} onClose={endHandleClose}>
        <div className="flex items-center justify-center relative mb-10 mt-3 mx-[24px]">
          <div
            onClick={endHandleClose}
            className="absolute -right-5 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
          >
            <CloseIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center flex-col justify-center w-full px-10 mb-[30px]">
          <SuccessIcon className="my-[33px] h-[130px] w-[130px]" />
          {endOpen === 1 ? (
            <h1 className="text-3xl text-center font-bold mb-10 font-Unbounded">
              Stablecoin <br /> Added
            </h1>
          ) : (
            <h1 className="text-3xl text-center font-bold mb-10 font-Unbounded">
              Stablecoin <br /> Removed
            </h1>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default Dashboard;

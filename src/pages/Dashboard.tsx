import { NETWORK } from "config/constants/networks";
import { useAppDispatch } from "hooks/useRedux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectNet } from "redux/selectedNet";
import { getTokens } from "services/firebase";
import { DemoDataProps } from "types/config";

const Dashboard = () => {
  const nativate = useNavigate();
  const dispatch = useAppDispatch();
  const setNet = (one) => {
    dispatch(selectNet(one));
    nativate("/stables");
  };

  const [tokensData, setTokensData] = useState([]);

  const prepareTokensData = async () => {
    const tokensData = await getTokens();

    setTokensData(
      NETWORK.map((n) => ({
        ...n,
        token: tokensData[n.chainId || 0] || [],
      }))
    );
  };

  useEffect(() => {
    prepareTokensData();
  }, []);

  return (
    <div className="card p-8">
      <div className="px-10 mb-5">
        <h1 className="text-4xl font-bold font-Unbounded">Welcome, Admin</h1>

        <div className="grid grid-cols-2 gap-4 mt-10">
          {tokensData.map((one: DemoDataProps, i: number) => (
            <div
              key={i}
              onClick={() => setNet(one)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border-[0.6px] border-[#ACACAE] py-4 px-5"
            >
              <div className="flex items-center">
                <img
                  src={one.icon}
                  alt="logo"
                  className="h-[38px] w-[38px] rounded-full bg-white"
                />
                <p className="text-base ml-2">{one.name}</p>
              </div>
              <div className="text-center ml-10">
                <p className="text-xl font-medium">{one.token.filter(({isAllowed}) => (isAllowed === true)).length}</p>
                <p className="text-xs">Stables listed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

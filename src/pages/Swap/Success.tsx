import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import _find from "lodash/find";

// Icons
import { ReactComponent as SuccessIcon } from "assets/img/icon/success.svg";
import useConfig from "hooks/useConfig";
import MobileCard from "components/MobileCard";
import { useAppSelector } from "hooks/useRedux";

const Success = () => {
  const navigate = useNavigate();
  const { isMobile } = useConfig();
  const swap = useAppSelector((state) => state.swap);
  const network = useAppSelector((state) => state.network);

  const swapData = useMemo(() => {
    return {
      from: _find(network.token, ["idx", swap.sIdx]) || {},
      to: _find(network.token, ["idx", swap.rIdx]) || {},
    };
  }, [network.token, swap]);

  if (isMobile) {
    return (
      <MobileCard>
        <div
          className="bg-[#242429] rounded-t-3xl py-[30px] px-5 flex flex-col items-center justify-center w-full absolute bottom-0"
          style={{ height: "calc(100vh - 72px - 28px)" }}
        >
          <h2 className="text-2xl font-bold font-Unbounded text-center">
            Conversion <br />
            Successful!
          </h2>
          <div className="flex flex-col items-center justify-center w-full">
            <SuccessIcon className="my-[33px] h-[100px] w-[100px]" />
            <h4 className="text-sm font-medium font-Unbounded text-center  mb-5">
              {`${swap.fAmount} ${swapData.from.name} has been converted to ${swap.tAmount} ${swapData.to.name}`}
            </h4>
            <div className="flex flex-col my-8 w-full">
              <button
                className="text-center py-4 w-full text-sm font-medium bg-[#5a4ee8] rounded-lg cursor-pointer"
                onClick={() => navigate("/swap")}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </MobileCard>
    );
  } else {
    return (
      <div className="card py-7 min-h-[500px] w-[550px] px-[10px]">
        <h2 className="text-4xl font-bold font-Unbounded text-center">
          Conversion <br />
          Successful!
        </h2>
        <div className="flex flex-col items-center justify-center px-[64px]">
          <SuccessIcon className="my-[33px] h-[130px] w-[130px]" />
          <h4 className="text-sm font-medium font-Unbounded text-center  mb-[60px]">
            {`${swap.fAmount} ${swapData.from.name} has been converted to ${swapData.to.name}`}
          </h4>

          <button
            className="text-center py-4 w-full text-base font-medium bg-[#5a4ee8] rounded-lg cursor-pointer"
            onClick={() => navigate("/swap")}
          >
            Done
          </button>
        </div>
      </div>
    );
  }
};

export default Success;

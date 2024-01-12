import { useNavigate, useSearchParams } from "react-router-dom";

import MobileCard from "components/MobileCard";

// Icons
import { ReactComponent as SuccessIcon } from "assets/img/icon/success.svg";
import useConfig from "hooks/useConfig";

const Success = () => {
  const navigate = useNavigate();
  const { isMobile } = useConfig();

  const [searchParams] = useSearchParams();

  if (isMobile) {
    return (
      <MobileCard>
        <div
          className="bg-[#242429] rounded-t-3xl py-[30px] px-5 flex flex-col items-center justify-center w-full absolute bottom-0"
          style={{ height: "calc(100vh - 52px)" }}
        >
          <h2 className="text-2xl font-bold font-Unbounded text-center">
            Transaction <br />
            Successful!
          </h2>
          <div className="flex flex-col items-center justify-center w-full">
            <SuccessIcon className="my-[33px] h-[100px] w-[100px]" />
            <h4 className="text-sm font-medium font-Unbounded text-center  mb-5">
              The stables have been settled to both <br /> wallet addresses
            </h4>
            <div className="flex flex-col my-8 w-full">
              <a
                rel="noreferrer"
                target="_blank"
                href={searchParams.get("txUrl")}
                className="text-center py-4 px-2 min-w-[150px] text-sm font-medium mb-4 bg-[#FFFFFF] rounded-lg text-[#151518] cursor-pointer"
              >
                View on Network Explorer
              </a>
              <button
                className="text-center py-4 min-w-[170px] text-sm font-medium bg-[#5a4ee8] rounded-lg cursor-pointer"
                onClick={() => navigate("/send")}
              >
                Done
              </button>
            </div>
            <p className="text-center text-md">
              Incase of any disputes, contact our support <br /> team at{" "}
              <a href="mailto:support@usewavy.xyz" className="text-[#B8ACFF]">
                support@usewavy.xyz
              </a>
            </p>
          </div>
        </div>
      </MobileCard>
    );
  } else {
    return (
      <div className="card py-7 min-h-[500px] w-[550px] px-[10px]">
        <h2 className="text-4xl font-bold font-Unbounded text-center">
          Transaction <br />
          Successful!
        </h2>
        <div className="flex flex-col items-center justify-center px-[64px]">
          <SuccessIcon className="my-[33px] h-[130px] w-[130px]" />
          <h4 className="text-sm font-medium font-Unbounded text-center  mb-5">
            The stables have been settled to both <br /> wallet addresses
          </h4>
          <div className="flex justify-between items-center my-8 w-full">
            <a
              rel="noreferrer"
              target="_blank"
              href={searchParams.get("txUrl")}
              className="text-center py-4 px-2 min-w-[150px] text-xs font-medium bg-[#FFFFFF] rounded-lg text-[#151518] cursor-pointer"
            >
              View on Network Explorer
            </a>
            <button
              className="text-center py-4 min-w-[170px] text-xs font-medium bg-[#5a4ee8] rounded-lg cursor-pointer"
              onClick={() => navigate("/send")}
            >
              Done
            </button>
          </div>
          <p className="text-center text-md mb-5">
            Incase of any disputes, contact our support <br /> team at{" "}
            <a href="mailto:support@usewavy.xyz" className="text-[#B8ACFF]">
              support@usewavy.xyz
            </a>
          </p>
        </div>
      </div>
    );
  }
};

export default Success;

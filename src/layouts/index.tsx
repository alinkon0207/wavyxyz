import Header from "components/Header";
import Wrapper from "./Wrapper";
import { ThemeContext } from "contexts/theme";
import { useAppSelector } from "hooks/useRedux";

const MainLayout = () => {
  const { sub } = useAppSelector((state) => state.network);
  const showAlert = sub.toLowerCase() === "stellar";
  const alertHeight = "2.5rem";

  return (
    <ThemeContext.Provider value={{ showAlert: showAlert, alertHeight }}>
      {showAlert && (
        <div className="bg-[#3D1ADA] h-10 flex justify-center items-center">
          <span>Please note that the features on this network are still in a beta state and may be subject to ongoing development and refinement.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full">
        <Header />
        <Wrapper />
      </div>
    </ThemeContext.Provider>
  );
};

export default MainLayout;

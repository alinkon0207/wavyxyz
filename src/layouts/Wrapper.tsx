import { ThemeContext } from "contexts/theme";
import useConfig from "hooks/useConfig";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

const Wrapper = () => {
  const { isMobile } = useConfig();
  const themeData = useContext(ThemeContext);

  const alertHeight = themeData.showAlert ? themeData.alertHeight : '0px';

  return (
    <div
      className="flex items-start justify-center md:pt-20 pt-10"
      style={{
        minHeight: isMobile
          ? `calc(100vh - ${alertHeight} - 52px)`
          : `calc(100vh - ${alertHeight} - 40px - 44px)`,
      }}
    >
      <Outlet />
    </div>
  );
};

export default Wrapper;

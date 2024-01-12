import { useState } from "react";
// Icon
import { ReactComponent as KeyboardArrowDownIcon } from "assets/img/icon/chevron-down.svg";

import useConfig from "hooks/useConfig";

const ValueInput = ({
  title,
  value,
  setValue,
  available,
  disabledValue = false,
  availableAmt = 0,
  error = "",
  placeholder = "",
  token,
  classes,
  disable,
  hideTitle,
  onChange,
}: any) => {
  const data = useConfig();
  const [val, setVal] = useState(value);

  const isControlled = typeof setValue === "function";

  const handleValue = (e: any) => {
    if (isControlled) {
      setValue(e.target.value);
    } else {
      setVal(e.target.value);
    }
  };

  const changeToken = () => {
    onChange && onChange();
  };

  if (data.isMobile) {
    return (
      <div>
        <div className="flex w-full align-center justify-between mb-3">
          <span className="text-sm text-light-dark">
            {title && !hideTitle ? title : ""}
          </span>
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <div
            className={`${classes} flex flex-col rounded-lg w-full border-[0.6px] px-5 py-2`}
            style={{ borderColor: error ? "#FF0004" : "#ACACAE" }}
          >
            <div className="flex flex-row w-full align-center justify-start">
              <input
                lang="en"
                type="number"
                min="0"
                onKeyDown={(e) => {if ([69, 187, 188, 189, 109, 107].includes(e?.keyCode)) {
                  e.preventDefault();
                }}}
                value={isControlled ? value : val}
                disabled={disabledValue}
                onChange={handleValue}
                placeholder={placeholder}
                className="w-1/2 p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
                style={{ fontSize: "18px !important" }}
              />
              <div className="flex items-center justify-center">
                <div
                  className="flex items-center w-full cursor-pointer border-l-[1px] border-[#ACACAE] pl-8"
                  onClick={changeToken}
                >
                  <img
                    src={token.icon ? token.icon : `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${token.icon}`}
                    alt="token"
                    className="w-[28px] h-[28px] rounded-full"
                  />
                  <span className="text-sm ml-2 ">{token.name}</span>
                  {onChange ? (
                    <KeyboardArrowDownIcon className="mx-2 w-3" />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {disable && (
            <div className="absolute w-full h-full top-0 left-0 bg-[#00000082]" />
          )}
        </div>
        <p className="text-sm text-right mt-4">
          {available ? `Available: ${availableAmt} ${token.name}` : ""}
        </p>
      </div>
    );
  } else {
    return (
      <div
        className={`${classes} flex flex-col rounded-lg w-full border-[0.6px] px-5 py-2`}
        style={{ borderColor: error ? "#FF0004" : "#ACACAE" }}
      >
        <div className="flex w-full align-center justify-between">
          <span className="text-sm">{title && !hideTitle ? title : ""}</span>
          <span className="text-sm">
            {available ? `Available: ${availableAmt} ${token.name}` : ""}
          </span>
        </div>
        <div className="flex flex-row w-full align-center justify-between">
          <div className="flex flex-col w-4/5">
            <input
              lang="en"
              type="number"
              value={isControlled ? value : val}
              onChange={handleValue}
              disabled={disabledValue}
              placeholder={placeholder}
              className="w-full p-0 border-none text-[30px] leading-none text-[#ffffff] mt-[4px] bg-transparent"
              onKeyDown={(e) => { if ([69, 187, 188, 189, 109, 107].includes(e?.keyCode)) {
                e.preventDefault();
              }}}
            />
            {error ? (
              <span className="text-xs text-rose-700">{error}</span>
            ) : null}
          </div>
          <div className="flex items-center justify-center">
            <div
              className="flex items-center w-full cursor-pointer min-w-[84px]"
              onClick={changeToken}
            >
              <img
                src={token.icon ? token.icon : `https://dummyimage.com/50x50/2E2E4D/ffffff&text=${token.icon}`}
                alt="token"
                className="w-[28px] h-[28px] rounded-full"
              />
              <span className="text-sm ml-2 mr-1 ">{token.name}</span>
              {onChange ? <KeyboardArrowDownIcon className="w-4" /> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ValueInput;

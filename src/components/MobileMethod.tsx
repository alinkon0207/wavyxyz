import { useState, useEffect } from 'react';
// Icons
import { ReactComponent as CloseIcon } from 'assets/img/icon/close.svg';
import { ReactComponent as ChevronRightIcon } from 'assets/img/icon/chevron-right.svg';

import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import { changeMethod } from 'redux/info';

const MobileMethod = ({ isTop, size, close, callback, tokenName }: any) => {
    const prevent = (e: any) => {
        e.preventDefault();
    };
    const dispatch = useAppDispatch();
    const { methods } = useAppSelector((state) => state.info);
    const [showChild, setShowChild] = useState(false);
    const [childrens, setChildrens] = useState([]);

    const selectMethod = (method: { title: string; icon: string; sub: string; child?: any }) => {
        if (method.child) {
            setChildrens(method.child);
            setShowChild(true);
        } else {
            dispatch(changeMethod({ title: method.title, icon: method.icon }));
            callback();
        }
    };

    useEffect(() => {
        setShowChild(false);
    }, []);

    return (
        <>
            <div
                className="flex flex-col w-full fixed bottom-0 left-0 z-10 px-5 pt-10 bg-[#151518] rounded-t-3xl shadow-[0px_-4px_20px_13px_black]"
                onClick={prevent}
            >
                <div className="flex items-start justify-center relative">
                    {close && (
                        <div
                            onClick={close}
                            className="absolute right-0 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
                        >
                            <CloseIcon className="h-4 w-4" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-center text-xl font-bold font-Unbounded ">
                            {showChild ? 'Choose a provider' : isTop ? 'Top up with' : 'Withdraw to'}
                        </h2>
                        <p className="text-center text-sm text-[#ACACAE]">
                            {showChild
                                ? 'Select a provider to Top Up with your Bank account'
                                : isTop
                                ? 'Select top up option'
                                : 'Select withdrawal option'}
                        </p>
                    </div>
                </div>
                <div className="py-[30px]">
                    <div className="py-2">
                        {showChild
                            ? childrens.map((one: any, i: number) => (
                                  <div className="flex flex-col" key={i}>
                                      <li
                                          className="cursor-pointer px-5 py-4 mb-2 bg-[#242429] rounded-lg flex items-center "
                                          onClick={() => selectMethod(one)}
                                      >
                                          <div className="bg-[#494979] mr-2 w-[34px] h-[34px] flex items-center justify-center rounded-full">
                                              <img src={one.icon} className="h-[20px] w-[20px]" alt="currency" />
                                          </div>
                                          <div className="mr-auto">
                                              <p> {one.title}</p>
                                              <p className="text-xs text-[#ACACAE] whitespace-pre-wrap">{one.sub}</p>
                                          </div>
                                          <ChevronRightIcon className="w-4 h-4" />
                                      </li>
                                  </div>
                              ))
                            : methods.list.map((one: any, i: number) => (
                                  <div className="flex flex-col" key={i}>
                                      <li
                                          className="cursor-pointer px-5 py-4 mb-2 bg-[#242429] rounded-lg flex items-center "
                                          onClick={() => selectMethod(one)}
                                      >
                                          <div className="bg-[#494979] mr-2 w-[34px] h-[34px] flex items-center justify-center rounded-full">
                                              <img src={one.icon} className="h-[20px] w-[20px]" alt="currency" />
                                          </div>
                                          <div className="mr-auto">
                                              <p> {one.title}</p>
                                              <p className="text-xs text-[#ACACAE] whitespace-pre-wrap">{one.sub}</p>
                                          </div>
                                          <ChevronRightIcon className="w-4 h-4" />
                                      </li>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
            <div className="fixed w-screen h-screen top-0 left-0 bg-[#00000066]" onClick={close} />
        </>
    );
};

export default MobileMethod;

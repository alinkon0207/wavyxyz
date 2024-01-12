import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Icon
import { ReactComponent as BackIcon } from 'assets/img/icon/arrow_back.svg';
import { ReactComponent as KeyboardArrowDownIcon } from 'assets/img/icon/chevron-down.svg';

// Constant
import { CURRENCY, LANGUAGE } from 'config/constants/demo';

const data = {
    lang: LANGUAGE,
    currency: CURRENCY
};

const MoreInfo = ({
    connect,
    close,
    infoHandle,
    wallet,
    infoData,
    infoCallback,
    langIcon,
    langCallback,
    currency,
    currencyCallback
}: any) => {
    const [showList, setShowList] = useState('');

    const prevent = (e: any) => {
        e.preventDefault();
    };

    const setData = (i: number) => {
        if (showList === 'lang') {
            langCallback(i);
        } else {
            currencyCallback(i);
        }
        setShowList('');
    };

    return (
        <>
            <div
                className="flex flex-col w-full fixed bottom-0 left-0 z-10 px-5 pt-10 bg-[#151518] rounded-t-3xl"
                onClick={prevent}
            >
                <div className="flex items-center justify-between">
                    {connect === null ? (
                        <div className="text-base">No wallet connected</div>
                    ) : (
                        <div className="flex items-center" onClick={infoHandle}>
                            <img src={connect.icon} alt="currency" className="mr-2" />
                            GALH....Z7I7
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        {connect !== null ? (
                            <>
                                <CopyToClipboard
                                    text={'0xCC70F722FA203D78580314817B7875cd90FED2d5'}
                                    onCopy={() => infoCallback(0)}
                                >
                                    <div className="flex items-center justify-center h-[42px] w-[42px] bg-[#423F51] rounded-full mr-7">
                                        <img src={infoData[0].mIcon} alt="lang" className="h-[24px] w-[24px]" />
                                    </div>
                                </CopyToClipboard>
                                <div
                                    onClick={() => infoCallback(1)}
                                    className="flex items-center justify-center h-[42px] w-[42px] bg-[#423F51] rounded-full mr-7"
                                >
                                    <img src={infoData[1].mIcon} alt="lang" className="h-[24px] w-[24px]" />
                                </div>
                            </>
                        ) : null}
                        <div
                            className="flex items-center justify-center h-[42px] w-[42px] bg-[#423F51] rounded-full"
                            onClick={() => setShowList('lang')}
                        >
                            <img src={langIcon} alt="lang" className="h-[30px] w-[30px]" />
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setShowList('currency')}
                    className="border-[0.5px] border-[#ACACAE] rounded-lg py-4 flex items-center justify-center mt-[50px] mb-[90px]"
                >
                    <img src={currency.icon} alt="currency" className="h-[30px] w-[30px]" />
                    <p className="mx-5">{currency.name}</p>
                    <KeyboardArrowDownIcon />
                </div>
            </div>
            <div className="fixed w-screen h-screen top-0 left-0 bg-[#00000066]" onClick={close} />
            {showList && (
                <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 bg-[#1E1E1E] px-5 py-10 z-20">
                    <div className="flex w-full items-center justify-center relative mb-10">
                        <div
                            onClick={() => setShowList('')}
                            className="absolute left-0 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
                        >
                            <BackIcon className="h-7 w-7" />
                        </div>
                        <h2 className="text-center text-base font-bold font-Unbounded ">Select Currency</h2>
                    </div>
                    {data[showList].map(({ name, icon }: { name: string; icon: string }, i: number) => (
                        <div className="flex flex-col" key={i}>
                            {Boolean(i) && <div className="border-[#ACACAE] border-t-[0.6px]" />}
                            <li className="py-4 px-5 flex cursor-pointer" onClick={() => setData(i)}>
                                <div className="mr-3 w-[30px] h-[30px]">
                                    <img src={icon} alt="currency" />
                                </div>
                                <div>
                                    <span className="text-md">{name}</span>
                                </div>
                            </li>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MoreInfo;

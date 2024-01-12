import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import _find from "lodash/find";

// Icon
import { ReactComponent as SearchIcon } from 'assets/img/icon/search.svg';
import { ReactComponent as KeyboardArrowDownIcon } from 'assets/img/icon/chevron-down.svg';

// component
import Card from 'components/Card';
import MobileCard from 'components/MobileCard';
import ValueInput from 'components/ValueInput';

// Constant
import useConfig from 'hooks/useConfig';
import MobileMethod from 'components/MobileMethod';
import { getMatch, getPaymentMethod } from 'config/constants/demo';
import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import { changeSetToken } from 'redux/selectToken';
import { setTopUpToken } from 'redux/topUp';
import { changeMethod } from 'redux/info';

const TopUp = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { isMobile } = useConfig();
    const topUp = useAppSelector((state) => state.topUp);
    const network = useAppSelector((state) => state.network);
    const { methods } = useAppSelector((state) => state.info);

    const [value, setValue] = useState('');
    const [page, setPage] = useState(1);
    const [tokenName, setTokenName] = useState('');
    const [topUpData, setTopUpData] = useState({ send: {}, receive: {}, method: [] });

    useEffect(() => {
        const receive = _find(network.token, ["idx", topUp.rIdx]) || {};
        const send = getMatch(receive.name);
        const method: any = getPaymentMethod(network.sub, receive.name, 'topup');
        if (method.length === 1 && !method[0].child) {
            dispatch(changeMethod({ title: method[0].title, icon: method[0].icon, list: method }));
        } else {
            dispatch(changeMethod({ list: method }));
        }
        setTopUpData({
            send: { ...send, amount: 80840 },
            receive,
            method
        });
        // eslint-disable-next-line
    }, [network, topUp]);

    const selectToken = () => {
        dispatch(changeSetToken({ key: 'TOPUP', order: -1, type: 'rIdx', tokens: network.token }));
        navigate('/select');
    };

    const setToken = (token: any, i: number) => {
        setTokenName(token.name);
        dispatch(setTopUpToken({ rIdx: i }));
        setPage(2);
    };

    const callback = () => {
        setPage(3);
    };

    const goMethodPage = () => {
        if (methods.list.length > 1 || methods.list[0].child) navigate('method');
    };

    const goback = () => {
        setPage(4);
    };

    if (isMobile) {
        return (
            <>
                {(() => {
                    if (page === 3 || page === 4) {
                        return (
                            <MobileCard title="Top up" back={() => setPage(1)}>
                                <div className="flex flex-col w-full px-5">
                                    <div className="flex flex-col w-full">
                                        <ValueInput title="Amount" value={0.0} token={topUpData.send} />
                                        <p className="text-[#B8ACFF] my-4">Fee: 0.00</p>
                                        <ValueInput
                                            title="Receive"
                                            available={true}
                                            value={0.0}
                                            token={topUpData.receive}
                                            onChange={() => setPage(1)}
                                        />

                                        <div
                                            onClick={goback}
                                            className="rounded-lg w-full border-[0.6px]  bg-[#242429] rounded-lg py-3 px-6 mt-9 mb-16 flex items-center"
                                        >
                                            <img src={methods.icon} className="h-[30px] w-[30px] mr-4" alt="img" />
                                            <div>
                                                <p>{methods.title}</p>
                                                <p className="text-xs text-[#ACACAE]">Top up with your bank account</p>
                                            </div>
                                        </div>
                                        <button className="w-full text-center py-4 bg-[#5a4ee8] rounded-lg cursor-pointer">
                                            Continue
                                        </button>
                                    </div>
                                </div>
                                {page === 4 && (
                                    <MobileMethod
                                        isTop={true}
                                        close={() => setPage(3)}
                                        callback={callback}
                                        tokenName={tokenName}
                                    />
                                )}
                            </MobileCard>
                        );
                    } else {
                        return (
                            <MobileCard title="Top up" back={() => navigate(-1)}>
                                <div className="flex flex-col w-full px-5">
                                    <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-1 px-4">
                                        <SearchIcon className="absolute h-[25px]" />
                                        <input
                                            className="w-full bg-transparent pl-8"
                                            placeholder="Search"
                                            onChange={(e: any) => setValue(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full rounded-lg py-3 my-5 pl-5  mb-[120px] rounded-lg bg-[#242429]">
                                        <div className="w-full pr-5">
                                            {network.token
                                                .map((e: any, i: number) => ({ ...e, idx: i }))
                                                .filter((e: any) => {
                                                    const string = e.name.toLowerCase() + ' ' + e.sub.toLowerCase();
                                                    return string.search(value.toLocaleLowerCase()) !== -1;
                                                })
                                                .map(({ name, sub, icon, amount, price, idx }: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        onClick={() =>
                                                            setToken({ name, sub, icon, amount, price }, idx)
                                                        }
                                                        className="flex items-center justify-between border-b-[1px] border-[#36363A] py-3 cursor-pointer"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="flex items-center justify-center border-2 border-[#FFFFFF] rounded-full mr-2">
                                                                <img
                                                                    src={icon}
                                                                    alt="icon"
                                                                    className="w-[25px] h-[25px] bg-white rounded-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium font-Unbounded">
                                                                    {name}
                                                                </p>
                                                                <p className="text-xs text-light-dark">{sub}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium font-Unbounded">
                                                                {amount}
                                                            </p>
                                                            <p className="text-xs font-medium text-light-dark text-right">
                                                                {price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                                {page === 2 && (
                                    <MobileMethod
                                        isTop={true}
                                        close={() => setPage(1)}
                                        callback={callback}
                                        tokenName={tokenName}
                                    />
                                )}
                            </MobileCard>
                        );
                    }
                })()}
            </>
        );
    } else {
        return (
            <Card title="Top Up" back={() => navigate('/')}>
                <div className="flex flex-col w-full">
                    <ValueInput title="Amount" value={0.0} token={topUpData.send} />
                    <p className="bg-[#090912] rounded-lg py-1 px-6 text-[#B8ACFF] my-4">Fee: 0.00</p>
                    <ValueInput
                        title="Receive"
                        available={true}
                        value={0.0}
                        token={topUpData.receive}
                        onChange={selectToken}
                    />
                    {methods && methods.title ? (
                        <div
                            onClick={goMethodPage}
                            className="bg-[#090912] rounded-lg py-3 px-6 mt-4 mb-16 flex items-center"
                        >
                            <img src={methods.icon} className="h-[24px] w-[24px] mr-2" alt="method" />{' '}
                            <span>{methods.title}</span>
                            <KeyboardArrowDownIcon className="ml-auto" />
                        </div>
                    ) : (
                        <div
                            onClick={goMethodPage}
                            className="bg-[#090912] rounded-lg py-2 px-6 mt-4 mb-16 flex items-center justify-between"
                        >
                            <span>Choose payment method</span>
                            <KeyboardArrowDownIcon />
                        </div>
                    )}
                    <button className="w-full text-center py-4 bg-[#5a4ee8] rounded-lg cursor-pointer">Continue</button>
                </div>
            </Card>
        );
    }
};

export default TopUp;

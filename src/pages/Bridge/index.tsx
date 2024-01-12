import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import _find from 'lodash/find';

// Icon
import { ReactComponent as KeyboardArrowDownIcon } from 'assets/img/icon/chevron-down.svg';

// component
import Card from 'components/Card';
import MobileCard from 'components/MobileCard';
import ValueInput from 'components/ValueInput';

// Constatn
import useConfig from 'hooks/useConfig';
import MobileList from 'components/MobileList';
import { NETWORK } from "config/constants/networks";
import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import { changeSetToken } from 'redux/selectToken';
import { setBridgeNet } from 'redux/bridge';

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { isMobile } = useConfig();
    const bridge = useAppSelector((state) => state.bridge);
    const network = useAppSelector((state) => state.network);

    const bridgeData = useMemo(() => {
        return {
            from: NETWORK[bridge.sNet],
            to: NETWORK[bridge.rNet],
            send: _find(network.token, ['idx', bridge.sIdx]),
            receive: _find(network.token, 'idx', [bridge.rIdx])
        };
        // eslint-disable-next-line
    }, [bridge]);

    const [setNet, setNetwork] = useState(false);

    const selectToken = (type: string) => {
        // const netIdx = type === 'sIdx' ? bridge.sNet : bridge.rNet;
        dispatch(changeSetToken({ key: 'BRIDGE', order: -1, type, tokens: network.token }));
        navigate('/select');
    };

    if (isMobile) {
        return (
            <MobileCard title="Bridge" back={() => navigate('/')}>
                <div className="bg-[#242429] rounded-t-3xl py-[30px] px-5">
                    <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 72px - 28px - 60px)' }}>
                        <div className="flex items-center mb-5">
                            <p className="text-sm mr-5 text-[#ACACAE] w-[40px]">From </p>
                            <div className="flex items-center cursor-pointer border-[0.6px] border-[#ACACAE] rounded-2xl px-2 py-2">
                                <div className="w-[24px] h-[24px] bg-white rounded-full border-[2px] flex items-center justify-center">
                                    <img src={bridgeData.from.icon} alt="token" className="bg-white rounded-full" />
                                </div>
                                <span className="text-sm mx-2">{bridgeData.from.name}</span>
                            </div>
                        </div>
                        <ValueInput
                            title="Amount"
                            hideTitle={true}
                            available={true}
                            onChange={() => selectToken('sIdx')}
                            value={bridgeData.send.amount}
                            token={bridgeData.send}
                        />

                        <div className="flex items-center mb-5 mt-8">
                            <p className="text-sm mr-5 text-[#ACACAE] w-[40px]">To </p>
                            <div
                                className="flex items-center cursor-pointer border-[0.6px] border-[#ACACAE] rounded-2xl px-2 py-2"
                                onClick={() => setNetwork(true)}
                            >
                                <div className="w-[24px] h-[24px] bg-white rounded-full border-[2px] flex items-center justify-center">
                                    <img src={bridgeData.to.icon} alt="token" className="bg-white rounded-full" />
                                </div>
                                <span className="text-sm mx-2">{bridgeData.to.name}</span>
                                <KeyboardArrowDownIcon className="w-4" />
                            </div>
                        </div>
                        <ValueInput
                            title="Receive"
                            hideTitle={true}
                            value={0.0}
                            available={true}
                            onChange={() => selectToken('rIdx')}
                            token={bridgeData.receive}
                        />

                        <button
                            className="w-full text-center py-4 mt-20 bg-[#5a4ee8] rounded-lg cursor-pointer"
                            onClick={() => navigate('/send/process')}
                        >
                            Continue
                        </button>
                    </div>
                </div>
                {setNet && (
                    <MobileList
                        title="Choose network"
                        sub="Choose your preferred network"
                        data={NETWORK.filter((_: any, j: number) => j !== bridge.sNet)}
                        close={() => setNetwork(false)}
                        callback={(i: number) => {
                            if (i >= bridge.sNet) {
                                dispatch(setBridgeNet({ rNet: i + 1 }));
                            } else {
                                dispatch(setBridgeNet({ rNet: i }));
                            }
                            setNetwork(false);
                        }}
                    />
                )}
            </MobileCard>
        );
    } else {
        return (
            <Card title="Bridge" back={() => navigate('/')}>
                <div className="flex flex-col w-full">
                    <div className="flex items-center mb-5">
                        <p className="text-base w-[40px] mx-5">From </p>
                        <div className="flex items-center cursor-pointer border-[0.6px] border-[#ACACAE] rounded-md px-2 py-2">
                            <div className="w-[24px] h-[24px] bg-white rounded-full border-[2px] flex items-center justify-center">
                                <img src={bridgeData.from.icon} alt="token" className="bg-white rounded-full" />
                            </div>
                            <span className="text-base mx-2">{bridgeData.from.name}</span>
                        </div>
                    </div>
                    <ValueInput
                        title="Amount"
                        hideTitle={true}
                        available={true}
                        onChange={() => selectToken('sIdx')}
                        value={bridgeData.send.amount}
                        token={bridgeData.send}
                    />

                    <div className="flex items-center mb-5 mt-8">
                        <p className="text-base w-[40px] mx-5">To </p>
                        <div
                            className="flex items-center cursor-pointer border-[0.6px] border-[#ACACAE] rounded-md px-2 py-2"
                            onClick={() => navigate('/select-net')}
                        >
                            <div className="w-[24px] h-[24px] bg-white rounded-full border-[2px] flex items-center justify-center">
                                <img src={bridgeData.to.icon} alt="token" className="bg-white rounded-full" />
                            </div>
                            <span className="text-base mx-2">{bridgeData.to.name}</span>
                            <KeyboardArrowDownIcon className="w-4" />
                        </div>
                    </div>
                    <ValueInput
                        title="Receive"
                        hideTitle={true}
                        value={0.0}
                        available={true}
                        onChange={() => selectToken('rIdx')}
                        token={bridgeData.receive}
                    />

                    <button
                        className="w-full text-center py-4 mt-10 bg-[#5a4ee8] rounded-lg cursor-pointer"
                        onClick={() => navigate('/send/process')}
                    >
                        Continue
                    </button>
                </div>
            </Card>
        );
    }
};

export default Index;

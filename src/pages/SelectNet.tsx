import { useNavigate } from 'react-router-dom';

// component
import Card from 'components/Card';

// Constatn
import { NETWORK } from "config/constants/networks";
import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import { setBridgeNet } from 'redux/bridge';

const SelectNet = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const bridge = useAppSelector((state) => state.bridge);

    const selectNet = (i: number) => {
        dispatch(setBridgeNet({ rNet: i }));
        navigate(-1);
    };

    return (
        <Card title="Select network" back={() => navigate(-1)}>
            <div className="flex flex-col w-full">
                <div className="h-[450px] overflow-auto w-full">
                    {NETWORK.map((_: any, k: number) => ({ ..._, idx: k }))
                        .filter((_: any, j: number) => j !== bridge.sNet)
                        .map(({ sub, icon, idx }: any, i: number) => (
                            <div
                                key={i}
                                onClick={() => selectNet(idx)}
                                className="flex items-center bg-dark-primary py-3 cursor-pointer rounded-lg px-4 mb-3"
                            >
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center border-2 border-[#FFFFFF] rounded-full mr-3">
                                        <img
                                            src={icon}
                                            alt="icon"
                                            className="w-[25px] h-[25px] bg-white rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium font-coinmedium">{sub}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </Card>
    );
};

export default SelectNet;

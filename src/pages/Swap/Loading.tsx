import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// component
import MobileCard from 'components/MobileCard';

import useConfig from 'hooks/useConfig';

const Loading = () => {
    const navigate = useNavigate();
    const { isMobile } = useConfig();

    useEffect(() => {
        setTimeout(() => {
            navigate('/swap/success');
        }, 2000);
    }, [navigate]);

    if (isMobile) {
        return (
            <MobileCard title="Processing">
                <div
                    className="bg-[#242429] rounded-t-3xl py-[30px] px-5 flex flex-col items-center justify-center w-full"
                    style={{ height: 'calc(100vh - 72px - 28px)' }}
                >
                    <div className="loader"></div>
                    <h4 className="text-lg font-medium text-center font-Unbounded mt-[55px] mb-6">
                        One moment, the transaction <br /> is being processed
                    </h4>
                    <p className="text-sm text-center text-[#F9FAFA]">
                        Stables are being swapped and should
                        <br />
                        be deposited in your wallet any
                        <br />
                        moment now
                    </p>
                </div>
            </MobileCard>
        );
    } else {
        return (
            <div className="card py-7 min-h-[500px] w-[550px]">
                <div className="flex flex-col items-center justify-center h-[500px] w-full">
                    <div className="loader"></div>
                    <h4 className="text-xl font-medium text-center font-Unbounded mt-[55px] mb-6">
                        One moment, the transaction <br /> is being processed
                    </h4>
                    <p className="text-base text-center text-[#F9FAFA]">
                        Stables are being swapped and should be <br /> deposited in your wallet any moment now
                    </p>
                </div>
            </div>
        );
    }
};
export default Loading;

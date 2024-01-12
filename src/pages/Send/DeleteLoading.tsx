import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// component
import Card from 'components/Card';
import MobileCard from 'components/MobileCard';

import useConfig from 'hooks/useConfig';

const Loading = () => {
    const navigate = useNavigate();
    const { isMobile } = useConfig();

    useEffect(() => {
        setTimeout(() => {
            navigate('/send/delete-success');
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
                        One moment, the refund is <br /> being processed
                    </h4>
                    <p className="text-base text-center text-[#F9FAFA]">
                        Stables are being returned to your <br /> wallet, should arrive any moment now
                    </p>
                </div>
            </MobileCard>
        );
    } else {
        return (
            <Card>
                <div className="flex flex-col items-center justify-center h-[500px] w-full">
                    <div className="loader"></div>
                    <h4 className="text-2xl font-medium font-Unbounded text-center mt-[55px] mb-5">
                        One moment, the refund is
                        <br /> being processed
                    </h4>
                    <p className="text-base text-center text-[#F9FAFA]">
                        Stables are being returned to your wallet,
                        <br /> should arrive any moment now
                    </p>
                </div>
            </Card>
        );
    }
};
export default Loading;

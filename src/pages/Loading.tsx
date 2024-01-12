import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/swap/success');
        }, 2000);
    }, [navigate]);

    return (
        <div className="card py-7 min-h-[500px] w-[550px]">
            <div className="flex flex-col items-center justify-center h-[500px] w-full">
                <div className="loader"></div>
                <h4 className="text-xl font-medium text-center font-Unbounded mt-[55px] mb-6">
                    One moment, the transaction <br /> is being processed
                </h4>
                <p className="text-sm text-center text-[#F9FAFA]">
                    Stables are being released to your wallet <br /> address as well as that of the counterparty
                </p>
            </div>
        </div>
    );
};
export default Loading;

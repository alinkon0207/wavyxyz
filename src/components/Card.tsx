// Icon
import { ReactComponent as BackIcon } from '../assets/img/icon/arrow_back.svg';

const Card = ({ children, title, back, lg }: { children: any; title?: string; back?: any; lg?: number }) => {
    return (
        <div
            className={
                lg ? `py-7 min-h-[500px] w-[650px] rounded-lg card` : 'card py-7 min-h-[500px] w-[550px] rounded-lg'
            }
        >
            <div className="flex items-center justify-center relative mb-10 mx-[24px]">
                {back && (
                    <div
                        onClick={back}
                        className="absolute left-0 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
                    >
                        <BackIcon className="h-7 w-7" />
                    </div>
                )}
                {title && <h2 className="text-center text-2xl font-bold font-Unbounded ">{title}</h2>}
            </div>
            <div className="flex flex-col items-center px-[64px]">{children}</div>
        </div>
    );
};

export default Card;

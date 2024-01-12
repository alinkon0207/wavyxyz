// Icon
import { ReactComponent as BackIcon } from '../assets/img/icon/arrow_back.svg';

const MobileCard = ({ children, title, back, fontSize }: any) => {
    return (
        <div className="card pt-7 h-screen w-screen fixed top-0 bottom-0 right-0 left-0 overflow-auto bg-[#151518] z-10">
            <div className="flex items-center justify-center relative mb-10 mx-[20px]">
                {back && (
                    <div
                        onClick={back}
                        className="absolute left-0 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
                    >
                        <BackIcon className="h-7 w-7" />
                    </div>
                )}
                {title && (
                    <h2
                        className="text-center  font-bold font-Unbounded "
                        style={{ fontSize: fontSize ? fontSize : 20 }}
                    >
                        {title}
                    </h2>
                )}
            </div>
            <div className="">{children}</div>
        </div>
    );
};

export default MobileCard;

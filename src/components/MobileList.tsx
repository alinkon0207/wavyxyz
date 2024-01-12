import { MenuListProps } from 'types/utils';

// Icons
import { ReactComponent as CloseIcon } from 'assets/img/icon/close.svg';

const MobileList = ({ title, sub, data, size, close, callback, notClose }: MenuListProps | any) => {
    const prevent = (e: any) => e.preventDefault();

    return (
        <>
            <div
                className="flex flex-col w-full fixed bottom-0 left-0 z-10 px-5 pt-10 bg-[#151518] rounded-t-3xl shadow-[0px_-4px_20px_13px_black]"
                onClick={prevent}
            >
                <div className="flex items-start justify-center relative">
                    {close && !notClose && (
                        <div
                            onClick={close}
                            className="absolute right-0 flex justify-center items-center p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer"
                        >
                            <CloseIcon className="h-4 w-4" />
                        </div>
                    )}
                    <div>
                        {title && <h2 className="text-center text-xl font-bold font-Unbounded ">{title}</h2>}
                        {sub && <p className="text-center text-sm text-[#ACACAE]">{sub}</p>}
                    </div>
                </div>
                <div className="py-[30px]">
                    <div className="rounded-lg overflow-hidden py-2 bg-[#242429]">
                        {data.map(({ name, icon }: { name: string; icon: string }, i: number) => (
                            <div className="flex flex-col" key={i}>
                                {Boolean(i) && <div className="border-[#ACACAE] border-t-[0.6px]" />}
                                <li
                                    className="bg-[242429] py-4 px-5 flex cursor-pointer flex items-center"
                                    onClick={() => callback(i)}
                                >
                                    <div className="mr-3" style={{ width: size ? size : 34, height: size ? size : 34 }}>
                                        <img src={icon} alt="currency" className="w-full h-full" />
                                    </div>
                                    <div>
                                        <span className="text-lg">{name}</span>
                                    </div>
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

export default MobileList;

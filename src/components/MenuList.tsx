import { MenuListProps } from 'types/utils';

const MenuList = ({ data, minWidth, py, size, top, anchor, close, callback, left }: MenuListProps | any) => {
    const event = (e: any, params: any) => {
        e.preventDefault();
        callback(params);
    };

    return (
        <>
            {Boolean(anchor) && (
                <>
                    <div
                        className="absolute left-0 py-2 rounded-lg bg-[#2e2d4e] z-20"
                        style={{ top, minWidth, left: left ? left : 0 }}
                    >
                        {data.map(({ name, icon }: { name: string; icon: string }, i: number) => (
                            <div className="flex flex-col" key={i}>
                                {Boolean(i) && <div className="border-[#ACACAE] border-t-[0.6px]" />}
                                <li className="py-2 px-5 flex cursor-pointer" onClick={(e: any) => event(e, i)}>
                                    <div className="mr-3 w-[24px] h-[24px]">
                                        <img src={icon} alt="currency" className="w-[24px] h-[24px]" />
                                    </div>
                                    <div>
                                        <span className="text-sm">{name}</span>
                                    </div>
                                </li>
                            </div>
                        ))}
                    </div>
                    <div className="fixed w-screen h-screen z-10 top-0 left-0" onClick={close} />
                </>
            )}
        </>
    );
};

export default MenuList;

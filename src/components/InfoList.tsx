import { CONNECTED } from 'config/constants/demo';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MenuListProps } from 'types/utils';

const MenuList = ({ minWidth, py, size, top, anchor, close, callback }: MenuListProps | any) => {
    const event = (e: any, params: any) => {
        e.preventDefault();
        callback(params);
    };

    return (
        <>
            {Boolean(anchor) && (
                <>
                    <div className="absolute left-0 py-2 rounded-lg bg-[#2e2d4e] z-20" style={{ top, minWidth }}>
                        <div className="flex flex-col">
                            <CopyToClipboard
                                text={'0xCC70F722FA203D78580314817B7875cd90FED2d5'}
                                onCopy={() => callback(0)}
                            >
                                <li className="py-2 px-5 flex cursor-pointer">
                                    <div className="mr-3" style={{ width: size ? size : 24, height: size ? size : 24 }}>
                                        <img
                                            src={CONNECTED[0].icon}
                                            alt="currency"
                                            style={{ width: size ? size : 24, height: size ? size : 24 }}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-sm whitespace-pre	">{CONNECTED[0].name}</span>
                                    </div>
                                </li>
                            </CopyToClipboard>
                        </div>
                        <div className="flex flex-col">
                            <div className="border-[#ACACAE] border-t-[0.6px]" />
                            <li className="py-2 px-5 flex cursor-pointer" onClick={(e: any) => event(e, 1)}>
                                <div className="mr-3" style={{ width: size ? size : 24, height: size ? size : 24 }}>
                                    <img
                                        src={CONNECTED[1].icon}
                                        alt="currency"
                                        style={{ width: size ? size : 24, height: size ? size : 24 }}
                                    />
                                </div>
                                <div>
                                    <span className="text-sm whitespace-pre	">{CONNECTED[1].name}</span>
                                </div>
                            </li>
                        </div>
                    </div>
                    <div className="fixed w-screen h-screen z-10 top-0 left-0" onClick={close} />
                </>
            )}
        </>
    );
};

export default MenuList;

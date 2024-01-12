import { useState } from 'react';
// import useLocalStorage from 'hooks/useLocalStorage';

import { ConfigContext, initialState } from 'contexts/config';
import useMediaQuery from 'hooks/useMediaQuery';

type ConfigProviderProps = {
    children: React.ReactNode;
};

const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const isMobile = useMediaQuery('(max-width:767px)');

    // const origin = window?.location.origin ?? 'wavy';
    // const [config, setConfig] = useLocalStorage(origin, {
    //     ...initialState
    // });
    const [config, setConfig] = useState({
        ...initialState
    });

    const changeData = ({ key, data }: { key: string; data: any }) => {
        setConfig((prevState) => ({
            ...prevState,
            [key]: data
        }));
    };
    const initData = (data: any) => {
        setConfig((prevState: any) => ({
            ...prevState,
            ...data
        }));
    };

    return (
        <ConfigContext.Provider value={{ ...config, isMobile, changeData, initData }}>
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigProvider;

import { EnvProps, ConfigProps } from 'types/config';

const NODE_ENV = import.meta.env.VITE_NODE_ENV;

// ** Secret config variables should be located in .env. [Todo]
const ENV: EnvProps = {
    development: {},
    production: {},
    test: {},
    network: {}
};

const Config: ConfigProps = {
    env: ENV[NODE_ENV]
};

export default Config;

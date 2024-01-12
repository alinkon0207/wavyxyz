import { DemoDataProps } from './config';

export type UtilsProps = {
    value: string;
    decimal: number;
};

export type MenuListProps = {
    data: DemoDataProps[];
    minWidth?: number;
    py?: number;
    size?: number;
    anchor: null | HTMLElement;
    close: any;
    callback: any;
    title?: any;
    sub?: any;
};

export type VlaueInputProps = {
    title?: string;
    available?: string;
    errorMessage?: string;
    error?: boolean;
    value?: number;
    token?: any;
    tokenList?: DemoDataProps[];
    classes?: string;
    disable?: boolean;
    hideTitle?: boolean;
    onChange?: any;
};

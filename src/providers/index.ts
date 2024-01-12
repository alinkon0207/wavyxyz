import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import MuiThemeProvider from './theme';
import ConfigProvider from './config';
import APIProvider from './api';
import { store } from '../redux/store';

const Root = createRoot(document.getElementById('wavy-app') as HTMLElement);

export { Root, MuiThemeProvider, ConfigProvider, APIProvider, Provider, store };

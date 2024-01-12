import App from './App';

import { Root, ConfigProvider, APIProvider, Provider, store } from './providers';

Root.render(
    <Provider store={store}>
        <ConfigProvider>
            <APIProvider>
                <App />
            </APIProvider>
        </ConfigProvider>
    </Provider>
);

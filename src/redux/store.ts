import { configureStore } from '@reduxjs/toolkit';
import networkReducer from './network';
import infoReducer from './info';
import sendReducer from './send';
import swapReducer from './swap';
import bridgeReducer from './bridge';
import topUpReducer from './topUp';
import withdrawReducer from './withdraw';
import selectTokenReducer from './selectToken';
import selectedNetReducer from './selectedNet';

export const store = configureStore({
    reducer: {
        network: networkReducer,
        info: infoReducer,
        send: sendReducer,
        swap: swapReducer,
        bridge: bridgeReducer,
        topUp: topUpReducer,
        withdraw: withdrawReducer,
        selectToken: selectTokenReducer,
        selectedNet: selectedNetReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

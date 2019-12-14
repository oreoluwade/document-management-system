import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers';

const persistConfig = {
    key: 'dms-root',
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
    return createStore(
        persistedReducer,
        compose(
            applyMiddleware(thunk),
            window.__REDUX_DEVTOOLS_EXTENSION__
                ? window.__REDUX_DEVTOOLS_EXTENSION__()
                : f => f
        )
    );
}

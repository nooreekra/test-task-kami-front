import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { ActionsType, appReducer } from './reducers/app-reducer';
import thunk, { ThunkAction } from 'redux-thunk';

const rootReducer = combineReducers({
    app: appReducer
})

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    }
}

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, ActionsType>;


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

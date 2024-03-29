// import createHistory from "history/createBrowserHistory";
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import reducer from "./reducers/reducer";
import rootSaga from "./rootSaga";
import createSagaMiddleware from "redux-saga";
import { generateContractsInitialState } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory();

const routingMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions)
};

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunkMiddleware, routingMiddleware, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export { history };
export { store };

export default store;

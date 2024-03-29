import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { drizzleReducers } from "@drizzle/store";
import userReducer from "./userReducer";

const reducer = combineReducers({
  user: userReducer,
  routing: routerReducer,
  ...drizzleReducers
});

export default reducer;

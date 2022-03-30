import { combineReducers } from "redux";
import userReducer from "./user/reducer";
import countReducer from "./count/reducer";
const rootReducer = combineReducers({
  userReducer,
  countReducer,
});

export default rootReducer;

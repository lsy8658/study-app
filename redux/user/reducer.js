import { LOGIN_START, LOGIN_SUCCESS, LOGOUT, LOGIN_FAILURE } from "../type";
import { Cookies } from "react-cookie";
import { useEffect } from "react";

const cookies = new Cookies();

const initialState = {
  user: cookies ? cookies.get("accessToken") : null,
  loading: false,
  err: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        user: null,
        isFetching: true,
        error: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: cookies.set("accessToken", action.payload),
        isFetching: false,
        error: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isFetching: false,
        error: true,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isFetching: false,
        error: false,
      };
    default:
      return state;
  }
};

export default userReducer;

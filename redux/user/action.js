import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "../type";

export const login_start = () => {
  return { type: LOGIN_START };
};

export const login_success = (user, decode) => {
  return { type: LOGIN_SUCCESS, payload: { user, decode } };
};

export const login_failure = () => {
  return { type: LOGIN_FAILURE };
};

export const login_out = () => {
  return { type: LOGOUT };
};

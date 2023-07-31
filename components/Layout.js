import React, { useEffect, useState } from "react";
import Chat from "../components/chat/Chat";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { login_start, login_success, login_failure, login_out } from "../redux";
const Layout = ({ children, login_success }) => {
  const [accessToken, setAccessToken] = useState("");
  const [decode, setDecode] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const router = useRouter();
  useEffect(() => {
    if (cookies.accessToken) {
      setAccessToken(cookies.accessToken.user);
      setDecode(cookies.accessToken.decode);
      const getTime = new Date().getTime() / 1000;
      if (decode) {
        if (getTime >= decode.exp - 100) {
          const refreshToken = async () => {
            if (cookies.refreshToken) {
              try {
                const res = await axios.post(
                  "https://port-0-study-app-server-ac2nlkqinq1x.sel4.cloudtype.app/api/auth/refresh",
                  {
                    email: decode.email,
                    token: cookies.refreshToken,
                  }
                );

                removeCookie("accessToken");
                setCookie("accessToken", {
                  user: res.data,
                  decode: jwt_decode(res.data),
                });

                alert("토큰이 새로 발급되었습니다.");
              } catch (err) {
                removeCookie("accessToken");
                removeCookie("refreshToken");
                alert("로그아웃 되었습니다.");
                window.location.reload();
                console.log(err);
              }
            }
          };
          refreshToken();
        }
      }
    }
  }, [cookies.accessToken, cookies, accessToken]);

  return (
    <div>
      {children}
      {accessToken !== "" ? <Chat /> : ""}
    </div>
  );
};
export const getStateProps = ({ userReducer }) => {
  return {
    state: userReducer,
  };
};
const getDispatchProps = {
  login_start,
  login_success,
  login_failure,
  login_out,
};
export default connect(getStateProps, getDispatchProps)(Layout);

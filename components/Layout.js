import React, { useEffect, useState } from "react";
import Chat from "../components/chat/Chat";
import { useCookies } from "react-cookie";
import axios from "axios";
const Layout = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [decode, setDecode] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(null);
  useEffect(() => {
    const getTime = new Date().getTime() / 1000;
    if (cookies.accessToken) {
      setAccessToken(cookies.accessToken.user);
      setDecode(cookies.accessToken.decode);
      // if (decode.exp) {
      //   if (getTime <= decode.exp) {
      //     const refreshToken = async () => {
      //       try {
      //         const res = await axios.post(
      //           "https://sy-study-app.herokuapp.com/api/auth/refresh",
      //           {
      //             email: decode.email,
      //           }
      //         );
      //         console.log(res);
      //         alert("토큰이 새로 발급되었습니다.");
      //       } catch (err) {
      //         console.log(err);
      //       }
      //     };
      //     refreshToken();
      //   }
      // }
      console.log(cookies.refreshToken, accessToken);
    }
  }, [cookies.accessToken, cookies, accessToken]);
  console.log(accessToken);
  console.log(decode);
  console.log();
  return (
    <div>
      {children}
      {accessToken !== "" ? <Chat /> : ""}
    </div>
  );
};

export default Layout;

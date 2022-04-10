import React, { useEffect, useState } from "react";
import Chat from "../components/chat/Chat";
import { useCookies } from "react-cookie";
const Layout = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();
  useEffect(() => {
    if (cookies) {
      setAccessToken(cookies.accessToken);
    }
  }, [cookies.accessToken, cookies]);
  return (
    <div>
      {children}
      {accessToken !== undefined ? <Chat /> : ""}
    </div>
  );
};

export default Layout;

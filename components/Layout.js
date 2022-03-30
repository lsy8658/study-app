import React, { useState } from "react";

import { Cookies } from "react-cookie";
import axios from "axios";
import jwtDecode from "jwt-decode";

const Layout = ({ children }) => {
  // const cookies = new Cookies();

  // const [tokenCheck, setTokenCheck] = useState(false);

  // const refreshToken = async () => {
  //   const date = Date.now();
  //   const userToken = cookies.get("accessToken");
  //   console.log(userToken);
  //   const tokenDecode = jwtDecode(userToken);
  //   console.log(tokenDecode);
  //   if (tokenDecode) {
  //     const token = tokenDecode.user;
  //     const email = tokenDecode.email;
  //     const tokenExp = tokenDecode.exp;
  //     console.log(date);
  //     console.log(tokenExp);
  //     console.log(email);
  //     if (Date.now() >= tokenExp * 1000) {
  //       //모달로 연장 물어보기
  //       const myToken = await axios.post(
  //         "http://localhost:5000/api/auth/getUser",
  //         { email: email }
  //       ); //db에서 token 가져오기
  //       let refresh = myToken.data;
  //       console.log(refresh);
  //       const newRefreshToken = await axios.post(
  //         "http://localhost:5000/api/auth/refresh",
  //         { token: refresh }
  //       ); // 토큰 재발급
  //       // console.log(newRefreshToken);
  //       const newAccessToken = newRefreshToken.data.accessToken;
  //       cookies.set("accessToken", newAccessToken);
  //       const updateToken = await axios.post(
  //         "http://localhost:5000/api/auth/updateToken",
  //         { token: refresh, email: email }
  //       ); // 토큰 db에 업데이트
  //       // console.log(updateToken);
  //     }
  //   } else {
  //     return;
  //   }
  // };
  // refreshToken();
  return <div>{children}</div>;
};

export default Layout;

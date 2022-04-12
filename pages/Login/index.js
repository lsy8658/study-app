import React, { useEffect, useRef, useState } from "react";
import styles from "./style/style.module.css";
import Link from "next/link";
import axios from "axios";
import Router from "next/router";
import { connect } from "react-redux";
import Seo from "../../components/Seo";

import {
  login_start,
  login_success,
  login_failure,
  login_out,
} from "../../redux";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
const index = ({ state, login_start, login_success, login_failure }) => {
  let isFetching = state.loading;
  const [cookies, setCookie, removeCookie] = useCookies();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const formHandle = async (e) => {
    e.preventDefault();
    login_start();
    try {
      const res = await axios.post(
        "https://sy-study-app.herokuapp.com/api/auth/login",
        input
      );

      login_success({
        user: res.data.accessToken,
        decode: jwt_decode(res.data.accessToken),
      });
      if (res.data.refreshToken) {
        setCookie("refreshToken", res.data.refreshToken);
      }
      setInput({
        email: "",
        password: "",
      });
      console.log(res);
      Router.push("/");
    } catch (err) {
      login_failure();
      console.log(err);
      alert("정보가 일치하지 않습니다.");
      window.location.reload();
    }
  };
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  // console.log(input);
  return (
    <>
      <Seo title={"Studyapp - Login"} />
      <div className={styles.container}>
        <div className={styles.wrap}>
          <h1>Study-cafe</h1>
          <div className={styles.loginFormBox}>
            <form className={styles.loginForm} onSubmit={formHandle}>
              <div className={styles.loginInput}>
                <input
                  name="email"
                  type="email"
                  placeholder="ID"
                  value={input.email}
                  onChange={inputHandle}
                />
              </div>
              <div className={styles.loginInput}>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={input.password}
                  onChange={inputHandle}
                />
              </div>

              <div className={styles.loginButton}>
                <button type="submit">
                  {isFetching ? "loading" : "Sign In"}
                </button>
              </div>
            </form>

            <div className={styles.registerButton}>
              <Link href={"/Register"}>Register</Link>
              <Link href={"/"}>Home</Link>
            </div>
          </div>
        </div>
      </div>
    </>
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

export default connect(getStateProps, getDispatchProps)(index);

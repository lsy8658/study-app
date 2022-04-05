import React, { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import styles from "./style/style.module.css";
import Image from "next/image";
import { useCookies } from "react-cookie";
import axios from "axios";

import { connect } from "react-redux";
import { login_out } from "../../redux/user/action";
const Nav = ({ state, login_out }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const [getUser, setGetUser] = useState();
  let cookie = cookies;
  // ---------------------------------------------

  useEffect(() => {
    let userState = state.user;
    let decodeState = state.user;
    if (
      userState !== undefined &&
      decodeState !== undefined &&
      cookie.accessToken
    ) {
      setToken(userState.user);
      setUser(decodeState.decode);
    }
  }, [cookie.accessToken, user]);
  // console.log(cookie.accessToken && cookie.accessToken.decode.email);
  // ---------user 값 가져와서 menu설정-------------

  useEffect(() => {
    const getUserFun = async () => {
      if (cookie.accessToken) {
        const email = cookie.accessToken.decode.email;

        try {
          const userId = await axios.post(
            "http://localhost:8080/api/user/getUser",
            {
              email,
            }
          );
          setGetUser(userId.data[0]._id);

          // const res = await axios.post();
        } catch (err) {
          console.log(err);
        }
      }
    };
    getUserFun();
  }, [cookie.accessToken]);
  // console.log(getUser);
  // headers: {
  //   authorization: `Bearer ${cookies.accessToken}`,
  // },

  // ---------login user,cookie 정보 가져오기-------------
  return (
    <>
      <div
        className={styles.modal}
        style={{ display: modal ? "block" : "none" }}
      >
        <div className={styles.iconXBox}>
          <Image
            src={"/assets/img/icon/x-icon1.png"}
            alt=""
            width={30}
            height={30}
            className={styles.iconX}
            onClick={() => {
              setModal(false);
            }}
          />
        </div>

        <div className={styles.modalNav}>
          <ul>
            {cookie.accessToken !== undefined && (
              <li>
                <Link href={`/Mypage/${getUser}`}>MY PAGE</Link>
              </li>
            )}

            <li>
              <Link href={"/Project"}>PROJECT</Link>
            </li>
            <li>
              <Link href={"/Study"}>STUDY</Link>
            </li>
            {cookie.accessToken !== undefined && (
              <li>
                <Link href={"/Work"}>WORK</Link>
              </li>
            )}
            {cookie.accessToken !== undefined ? (
              <li
                onClick={() => {
                  removeCookie("accessToken");
                  login_out();
                  setUser("");
                }}
              >
                <Link href={"/"}>Logout</Link>
              </li>
            ) : (
              <li>
                <Link href={"/Login"}>LOGIN</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className={styles.navContainer}>
        <div className={styles.navWrap}>
          <div className={styles.navMenu}>
            <Link href={"/"}>
              <h1 className={styles.navTitle}>Study-cafe</h1>
            </Link>
            <ul className={styles.navLi}>
              <li>
                <Link href={"/Study"}>Study</Link>
              </li>
              <li>
                <Link href={"/Project"}>Project</Link>
              </li>
              <li>
                <Link href={"/Work"}>Work</Link>
              </li>
            </ul>
          </div>
          <div className={styles.mainNav}>
            <div className={styles.navUserMenu}>
              {cookie.accessToken !== undefined ? (
                <>
                  <Link href={`/Mypage/${getUser}`}>My page</Link>
                  <div
                    onClick={() => {
                      removeCookie("accessToken");
                      removeCookie("refreshToken");
                      login_out();
                      setUser("");
                    }}
                  >
                    <Link href={"/"}>Logout</Link>
                  </div>
                </>
              ) : (
                <div className={styles.navUserMenu}>
                  <Link href={"/Login"}>Login</Link>
                </div>
              )}
            </div>
          </div>

          <div className={styles.mobileNav}>
            <Image
              src={"/assets/img/icon/menu.png"}
              alt=""
              width={40}
              height={25}
              onClick={() => {
                setModal(true);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const getState = ({ userReducer }) => {
  return {
    state: userReducer,
  };
};
const getDispatch = { login_out };
export default connect(getState, getDispatch)(Nav);

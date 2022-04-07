import React, { useRef, useState, useEffect } from "react";

import DaumPostcode from "react-daum-postcode";

import styles from "./style/style.module.css";
import Link from "next/link";
import axios from "axios";
import Router from "next/router";
import Seo from "../../components/Seo";
const index = () => {
  const [modal, setModal] = useState("none");
  const [address, setAddress] = useState("");
  const [input, setInput] = useState({
    email: "",
    password: "",
    name: "",
    developer: "웹 디자인",
  });
  const newUser = {
    email: input.email,
    password: input.password,
    name: input.name,
    address: address,
    developer: input.developer,
  };
  console.log(newUser);
  const formHandle = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://sy-study-app.herokuapp.com/api/auth/register",
        newUser
      );
      Router.push("/Login");
      console.log(res);
    } catch (err) {
      console.log(err);
    }

    // window.location.href = "/";
  };
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";

      setModal("none");
    }
    setAddress(fullAddress);
    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };
  const postCodeStyle = {
    display: modal,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    zIndex: "100",
    padding: "7px",
    width: "90%",
    maxWidth: "500px",
  };

  return (
    <div className={styles.container}>
      <Seo title={"Studyapp - Register"} />
      <div className={styles.wrap}>
        <h1>Register</h1>
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
            <div className={styles.loginInput}>
              <input
                name="name"
                type="text"
                placeholder="name"
                value={input.name}
                onChange={inputHandle}
              />
            </div>
            <div className={styles.loginInput}>
              <select
                name="developer"
                onChange={inputHandle}
                className={styles.selectInput}
              >
                <option>웹 디자인</option>
                <option>웹 퍼블리셔</option>
                <option>프론트엔드</option>
                <option>백엔드</option>
                <option>풀스텍</option>
                <option>앱 개발자</option>
              </select>
            </div>
            <div className={styles.loginInput} style={{ margin: "10px 0 " }}>
              {address !== "" && (
                <span className={styles.address}>{address}</span>
              )}
              <button
                className={styles.addressBtn}
                onClick={(e) => {
                  e.preventDefault();
                  setModal("block");
                }}
              >
                주소검색
              </button>
            </div>

            <div className={styles.loginButton}>
              <button type="submit">Sign In</button>
            </div>
          </form>
          <div className={styles.registerButton}>
            <Link href={"/Login"}>login</Link>
          </div>
        </div>
      </div>
      <div className={styles.addressBox} style={postCodeStyle}>
        <DaumPostcode onComplete={handleComplete} autoClose={false} />
        <button
          onClick={() => {
            setModal("none");
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default index;

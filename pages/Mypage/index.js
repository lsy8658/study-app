import styles from "./style/style.module.css";
import Nav from "../../components/nav/Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import DaumPostcode from "react-daum-postcode";
import Seo from "../../components/Seo";
const index = () => {
  const [password, setPassword] = useState(""); //비밀번호
  const [pwCheck, setPwCheck] = useState(""); //비밀번호 재확인
  const [infoDisplay, setInfoDisplay] = useState(null); //비밀번호 일치확인 box
  const [modal, setModal] = useState("none"); //집 주소 검색
  const [input, setInput] = useState({
    email: "",
    password: "",
    name: "",
    developer: "웹 디자인",
  });
  const [myPage, setMyPage] = useState(true);
  const [pwModify, setPwModify] = useState(false);
  const [infoModify, setInfoModify] = useState(false);
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (password !== "" && pwCheck !== "") {
      if (password === pwCheck) {
        return setInfoDisplay(false);
      } else if (password !== pwCheck) {
        return setInfoDisplay(true);
      }
    } else {
      return setInfoDisplay(null);
    }
  }, [password, pwCheck]);
  //-------------비밀번호 체크---------------
  const passwordHandle = (e) => {
    e.preventDefault();
    if (password !== pwCheck) {
      alert("암호를 확인해주세요.");
      return setInfoDisplay(true);
    }
  };
  //-------------비밀번호 변경---------------
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
    width: "100%",
    maxWidth: "500px",
  };

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    <div className={styles.containerBox}>
      <Seo title={"Studyapp - Mypage"} />
      <Nav />
      <div className={styles.container}>
        <div className={styles.aside}>
          <div
            className={`${styles.userInfo}`}
            style={{ display: myPage ? "block" : "none" }}
          >
            <h3>My Page</h3>
            <p>dltjddbns@naver.com</p>
            <p>신은제</p>
            <p>웹 디자인</p>
            <p>서울 000 000</p>
            <div className={styles.btns}>
              <button
                onClick={() => {
                  setMyPage(false);
                  setInfoModify(false);
                  setPwModify(true);
                }}
              >
                비밀번호 수정
              </button>
              <button
                onClick={() => {
                  setMyPage(false);
                  setInfoModify(true);
                  setPwModify(false);
                }}
              >
                정보 수정
              </button>
            </div>
          </div>
          {/* --------------------userInfoBox-------------------- */}

          <div
            className={`${styles.passwordForm}`}
            style={{ display: pwModify ? "block" : "none" }}
          >
            <h3>비밀번호 수정</h3>
            <form onSubmit={passwordHandle}>
              <input
                type="password"
                placeholder="비밀번호 입력"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="비밀번호 재입력"
                onChange={(e) => {
                  setPwCheck(e.target.value);
                }}
              />

              <p
                className={styles.input_state}
                style={{
                  display:
                    infoDisplay !== null
                      ? infoDisplay
                        ? "block"
                        : "none"
                      : "none",
                }}
              >
                비밀번호가 일치하지 않습니다.
              </p>
              <p
                className={styles.input_state}
                style={{
                  display:
                    infoDisplay !== null
                      ? infoDisplay
                        ? "none"
                        : "block"
                      : "none",
                }}
              >
                비밀번호가 일치 합니다.
              </p>
              <div className={styles.btns}>
                <button type="submit">변경하기</button>
                <button
                  onClick={() => {
                    setMyPage(true);
                    setInfoModify(false);
                    setPwModify(false);
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
          {/* --------------------passwordBox-------------------- */}
          <div
            className={`${styles.modifyForm}`}
            style={{ display: infoModify ? "block" : "none" }}
          >
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
            <h3>정보 수정</h3>
            <form onSubmit={passwordHandle}>
              <input type="password" placeholder="email" onChange={(e) => {}} />
              <input type="password" placeholder="이름" onChange={(e) => {}} />
              <div className={styles.modifyInput}>
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
              <div className={styles.modifyInput}>
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
              <div className={styles.btns}>
                <button type="submit">수정하기</button>
                <button
                  onClick={() => {
                    setMyPage(true);
                    setInfoModify(false);
                    setPwModify(false);
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
          {/* --------------------정보수정-------------------- */}
        </div>
        <div className={styles.rightBg}></div>
      </div>
    </div>
  );
};

export default index;

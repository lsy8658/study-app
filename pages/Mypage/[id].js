import styles from "./style/style.module.css";
import Nav from "../../components/nav/Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import DaumPostcode from "react-daum-postcode";
import Seo from "../../components/Seo";
import { connect } from "react-redux";
import { useCookies } from "react-cookie";
const index = ({ data, params }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [password, setPassword] = useState(""); //비밀번호
  const [pwCheck, setPwCheck] = useState(""); //비밀번호 재확인
  const [infoDisplay, setInfoDisplay] = useState(null); //비밀번호 일치확인 box
  const [modal, setModal] = useState("none"); //집 주소 검색

  const [myPage, setMyPage] = useState(true);
  const [pwModify, setPwModify] = useState(false);
  const [infoModify, setInfoModify] = useState(false);

  const [config, setConfig] = useState();
  const [getGrade, setGetGrade] = useState();

  useEffect(() => {
    if (cookies.accessToken) {
      const accessToken = cookies.accessToken.user;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setConfig(config);
    }
  }, [cookies.accessToken]);

  //-------------비밀번호 체크---------------
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
  //-------------------------------------------
  //----------------비밀번호 변경--------------

  const passwordHandle = async (e) => {
    e.preventDefault();
    const userId = params.id;
    if (password === pwCheck && password !== "" && pwCheck !== "") {
      if (cookies.accessToken) {
        try {
          const res = await axios.put(
            `https://sy-study-app.herokuapp.com/api/user/password/${userId}`,
            { password: password },
            config
          );

          alert("비밀번호가 수정되었습니다.");
          window.location.replace("/");
        } catch (err) {
          alert("토큰만료");
          console.log(err);
        }
      }
    } else {
      return setInfoDisplay(true);
    }
  };

  //-------------------------------------------
  const [address, setAddress] = useState("");
  const [input, setInput] = useState({
    name: "",
    developer: "웹 디자인",
  });
  const newUser = {
    name: input.name,
    address: address,
    developer: input.developer,
  };
  //----------------우편주소---------------------------
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

  //--------------------------------------------------

  //------------------정보수정-------------------------
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  //-------------------------------------------
  const formHandle = async (e) => {
    e.preventDefault();

    const userId = params.id;

    if (input.name !== "" && input.address !== "" && input.developer !== "") {
      try {
        const res = await axios.put(
          `https://sy-study-app.herokuapp.com/api/user/modify/${userId}`,
          newUser,
          config
        );
        console.log(newUser);
        console.log(res);
        alert("정보가 수정되었습니다.");
        window.location.replace("/");
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("정보를 전부 입력해주세요.");
      return;
    }
  };
  useEffect(() => {
    if (data.grade) {
      const grades = data.grade.reduce(
        (prev, curr) => {
          return Number(prev) + Number(curr);
        },
        [0]
      );
      const getGrade = grades / data.grade.length;
      setGetGrade(getGrade.toFixed(1));
    }
  }, [data]);

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
            <p>{data.email}</p>
            <p>
              평점 :
              <span
                style={{
                  color: getGrade <= 2.5 ? "red" : "green",
                  marginLeft: "5px",
                }}
              >
                {isNaN(getGrade) !== true ? getGrade : ""}
              </span>
            </p>

            <p>{data.name}</p>
            <p>{data.developer}</p>
            <p>{data.address}</p>
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
            <form onSubmit={formHandle}>
              <input
                type="text"
                placeholder={data.name}
                value={input.name}
                name="name"
                onChange={inputHandle}
              />
              <div className={styles.modifyInput}>
                <select
                  name="developer"
                  onChange={inputHandle}
                  className={styles.selectInput}
                >
                  <option>{data.developer}</option>
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
                  onClick={(e) => {
                    e.preventDefault();
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

const getReducerState = ({ userReducer }) => {
  return {
    state: userReducer,
  };
};

export default connect(getReducerState)(index);

export const getServerSideProps = async ({ params }) => {
  console.log(params);

  const res = await axios.get(
    `https://sy-study-app.herokuapp.com/api/user/${params.id}`
  );
  const data = res.data;
  return {
    props: { data: data, params },
  };
};

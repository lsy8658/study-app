import React, { useEffect, useState } from "react";
import styles from "./style/style.module.css";
import Image from "next/image";
import axios from "axios";
import moment from "moment";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
const index = ({ modal, setModal, data }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [desc, setDesc] = useState({});
  const [master, setMaster] = useState({});
  const [user, setUser] = useState({});
  const [waiting, setWaiting] = useState({});
  const [config, setConfig] = useState();
  const [memberLength, setMemberLength] = useState([]);
  const [getGrade, setGetGrade] = useState(); // 작성자 평점
  const router = useRouter();
  useEffect(() => {
    if (data) {
      setDesc(data);
      if (data.master) {
        const email = { email: data.master };
        try {
          const getStudys = async () => {
            const res = await axios.post(
              "http://localhost:8080/api/user/getUser",
              email
            );
            setMaster(res.data[0]);
          };
          getStudys();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [data]);
  useEffect(() => {
    if (cookies.accessToken) {
      const loginUser = cookies.accessToken.decode.email;
      const accessToken = cookies.accessToken.user;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setConfig(config);
      const getUser = async () => {
        const email = { email: loginUser };
        try {
          const res = await axios.post(
            "http://localhost:8080/api/user/getUser",
            email
          );
          setUser(res.data[0]);
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }
  }, [cookies.accessToken]);
  useEffect(() => {
    console.log(desc);
    console.log(master);
    console.log(user);
    if (desc.member_id) {
      const res = desc.member_id.filter((item) => {
        return item.user === user.email;
      });
      setWaiting(res[0]);

      const memberLength = desc.member_id.filter((item) => {
        return item.waiting === true;
      });
      setMemberLength(memberLength);
    }
    console.log(waiting);
    if (master.grade) {
      const grades = master.grade.reduce(
        (prev, curr) => {
          return Number(prev) + Number(curr);
        },
        [0]
      );
      const getGrade = grades / master.grade.length;
      setGetGrade(getGrade.toFixed(1));
    }
  }, [master, desc, waiting]);
  const newDate = moment(desc.createdAt).format("YYYY-MM-DD");
  const participateHandle = async () => {
    const userData = {
      user: user.email,
      waiting: false,
      grade: false,
    };
    console.log(userData);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/study/participate/${desc._id}`,
        userData,
        config
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    alert("참여하기 신청이 완료되었습니다.");
    // router.push("/");
    window.location.reload();
  };
  const abandonmentHandle = async () => {
    if (cookies.accessToken) {
      const loginUser = cookies.accessToken.decode.email;
      const email = {
        email: loginUser,
      };
      try {
        const res = await axios.post(
          `http://localhost:8080/api/study/abandonment/${desc._id}`,
          email,
          config
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
      alert("스터디를 중단하였습니다.");
      window.location.reload();
    }
  };

  const projectAbandonHandle = async () => {
    if (cookies.accessToken) {
      const loginUser = cookies.accessToken.decode.email;
      const email = {
        email: loginUser,
      };
      try {
        const res = await axios.post(
          `http://localhost:8080/api/study/studyAbandon/${desc._id}`,
          email,
          config
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
      alert("스터디를 중단하였습니다.");
      window.location.reload();
    }
  };
  return (
    <>
      <div
        className={styles.modalBg}
        style={{ display: modal ? "block" : "none" }}
        onClick={() => {
          setModal(false);
        }}
      ></div>
      <div
        className={styles.modal}
        style={{ display: modal ? "block" : "none" }}
      >
        <div className={styles.xIcon}>
          <Image
            width={24}
            height={24}
            src={"/assets/img/icon/x-icon2.png"}
            onClick={() => {
              setModal(false);
            }}
          />
        </div>
        <h2>Study</h2>
        <p className={styles.date}>Date: {newDate}</p>
        <div className={styles.workInfo}>
          <div className={styles.txtBox}>
            <p>
              Title :<span>{desc.title}</span>
            </p>
          </div>
          <div className={styles.txtBox}>
            <p>
              방장 : <span>{master.name}</span>
            </p>
            <p>
              위치 : <span>{desc.area}</span>
            </p>
          </div>
          <div className={styles.txtBox}>
            <p>
              평점 : <span>{!isNaN(getGrade) ? getGrade : ""}</span>
            </p>

            <p>
              인원 : <span>{desc.headCount}</span>
            </p>
          </div>
          <div className={styles.txtBox}>
            <p>
              대면 : <span>{desc.meet}</span>
            </p>
          </div>

          <div className={styles.txtBox}>
            <p>Lang : {desc.language}</p>
          </div>
        </div>
        <div className={styles.btns}>
          {cookies.accessToken ? (
            user.email !== master.email ? (
              waiting === undefined ? (
                memberLength.length !== Number(desc.headCount) ? (
                  <button className={styles.btn1} onClick={participateHandle}>
                    참여하기
                  </button>
                ) : (
                  ""
                )
              ) : waiting.waiting === true ? (
                <>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "red",
                      marginBottom: "5px",
                    }}
                  >
                    중도에 포기하시면 평점 2점이 부과됩니다.
                  </p>
                  <button className={styles.btn3} onClick={abandonmentHandle}>
                    포기하기
                  </button>
                </>
              ) : (
                <button className={styles.btn2}>대기중</button>
              )
            ) : (
              <>
                <p
                  style={{
                    fontSize: "13px",
                    color: "red",
                    marginBottom: "5px",
                  }}
                >
                  포기하시면 평점 2점과 Project가 사라집니다.
                </p>
                <button className={styles.btn3} onClick={projectAbandonHandle}>
                  포기하기
                </button>
              </>
            )
          ) : (
            ""
          )}
        </div>
      </div>
      {/* -------------------------------------------------- */}
      {/* <div className={styles.giveupModalBg}></div>
      <div className={styles.giveupModal}>
        <h3>프로젝트를 포기하시겠습니까?</h3>
        <p>프로젝트를 포기하시면 등급이 내려갈 수 있습니다.</p>
        <div className={styles.btns}>
          <button className={styles.btn}>포기</button>
          <button className={styles.btn}>취소</button>
        </div>
      </div> */}
    </>
  );
};

export default index;

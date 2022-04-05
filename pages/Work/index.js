import styles from "./style/style.module.css";
import Nav from "../../components/nav/Nav";
import Link from "next/link";
import GradeModal from "../../components/gradeModal/GradeModal";
import WaitingModal from "../../components/waitingModal/WaitingModal";
import { useEffect, useReducer, useState } from "react";
import Seo from "../../components/Seo";
import UrlModal from "../../components/urlModal/UrlModal";
import { connect } from "react-redux";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
const index = ({ state }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [boxDisplay, setBoxDisplay] = useState(true);
  const [user, setUser] = useState();
  const [config, setConfig] = useState({});
  const [project, setProject] = useState(null); //진행중인 프로젝트
  const [projectComplete, setProjectComplete] = useState(null); //완료한 프로젝트
  const [study, setStudy] = useState(null); //진행중인 study
  const [studyComplete, setStudyComplete] = useState(null); //완료한 study
  const [email, setEmail] = useState("");
  const [modalBg, setModalBg] = useState(false);
  const [urlModal, setUrlModal] = useState(false); //URL MODAL
  const [waiting, setWaiting] = useState(false);
  const [waitData, setWaitData] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (cookies.accessToken) {
      const accessToken = cookies.accessToken.user;
      const email = cookies.accessToken.decode.email;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setConfig(config);
      setEmail(email);
    }
    console.log(email);
  }, [cookies.accessToken, email]);

  useEffect(() => {
    if (state.user) {
      setUser(state.user.decode.email);
    }
    if (cookies.accessToken) {
      const getProject = async () => {
        const projectRes = await axios.get(
          "http://localhost:8080/api/project/getProject"
        );
        const studyRes = await axios.get(
          "http://localhost:8080/api/study/getStudy"
        );
        const progressData = projectRes.data;
        const studyData = studyRes.data;
        const progressSet = (item) => {
          for (let i = 0; i < 6; i++) {
            return (
              item.success === false &&
              item.member_id[i]?.user === email &&
              item.member_id[i]?.waiting === true
            );
          }
        };
        const completeSet = (item) => {
          for (let i = 0; i < 6; i++) {
            return (
              item.success === true &&
              item.member_id[i]?.user === email &&
              item.member_id[i]?.waiting === true
            );
          }
        }; /* 
        item.member_id[i]?.user에 대한 정보를 
        직접 불러오려하자 읽어오지 못한다는 error 가 나와서 index 값을 직접 넣어주었음..
        */
        const progress = await progressData.filter((item, index) => {
          return progressSet(item);
        });

        const complete = await projectRes.data.filter((item, index) => {
          return completeSet(item);
        });
        const studyProgress = await studyData.filter((item, index) => {
          return progressSet(item);
        });

        const studyComplete = await studyRes.data.filter((item, index) => {
          return completeSet(item);
        });

        setProject(progress);
        setProjectComplete(complete); //member_id에 포함되어있는 id인지 걸러야함
        setStudy(studyProgress);
        setStudyComplete(studyComplete);
      };

      getProject();
    }
  }, [user, state.user, email, cookies.accessToken]);

  useEffect(() => {
    // console.log(project);
    // console.log(projectComplete);
    // console.log(study);
    // console.log(studyComplete);
  }, [project, projectComplete, study, studyComplete]);

  return (
    <>
      <Seo title={"Studyapp-work"} />
      {/* <GradeModal setModalBg={setModalBg} /> */}

      <div
        className={styles.modalBg}
        style={{ display: `${modalBg ? "block" : "none"}` }}
        onClick={() => {
          setModalBg(false);
          setUrlModal(false);
        }}
      ></div>

      <div className={styles.container}>
        <Nav />
        <div className={styles.workContainer}>
          <div className={styles.aside}>
            <div className={styles.contents}>
              <div className={styles.btns}>
                <div className={styles.menuBtn}>
                  <button
                    className={`${styles.btn} ${
                      boxDisplay ? styles.active : ""
                    }`}
                    onClick={() => {
                      setBoxDisplay(true);
                    }}
                  >
                    PROJECT
                  </button>
                  <button
                    className={`${styles.btn} ${
                      boxDisplay ? "" : styles.active
                    }`}
                    onClick={() => {
                      setBoxDisplay(false);
                    }}
                  >
                    STUDY
                  </button>
                </div>

                <div className={styles.createBtn}>
                  <Link href={"/Create"}>Create</Link>
                </div>
              </div>
              <WaitingModal
                setModalBg={setModalBg}
                setWaiting={setWaiting}
                waiting={waiting}
                waitData={waitData}
              />
              <div
                className={styles.listCon}
                style={{ display: boxDisplay ? "block" : "none" }}
              >
                <div className={styles.listWrap}>
                  <h2>진행중</h2>
                  <div className={styles.listBox}>
                    {project ? (
                      project.map((item, index) => (
                        <div key={index}>
                          <UrlModal
                            setModalBg={setModalBg}
                            urlModal={urlModal}
                            projectId={item._id}
                            setUrlModal={setUrlModal}
                          />

                          <div className={styles.item}>
                            <div className={styles.waiting}>
                              <p
                                onClick={() => {
                                  setWaiting(true);
                                  setModalBg(true);
                                  setWaitData(item);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                대기
                                <span>
                                  {
                                    item.member_id.filter((item) => {
                                      return item.waiting == false;
                                    }).length
                                  }
                                </span>
                              </p>
                            </div>
                            <div className={styles.desc}>
                              <p>{item.title}</p>
                              {item.master === email && (
                                <button
                                  onClick={() => {
                                    setModalBg(true);
                                    setUrlModal(true);
                                  }}
                                >
                                  완료하기
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.loading}>Loading...</p>
                    )}
                  </div>
                </div>
                <div className={styles.listWrap}>
                  <h2>완료</h2>
                  <div className={styles.listBox}>
                    {projectComplete ? (
                      projectComplete.map((item, index) => (
                        <div className={styles.item} key={index}>
                          <div className={styles.desc}>
                            <p>{item.title}</p>
                            <div className={styles.btns1}>
                              <button>팀원평가</button>
                              <Link href={item.url}>URL</Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.loading}>Loading...</p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={styles.listCon}
                style={{ display: boxDisplay ? "none" : "block" }}
              >
                <div className={styles.listWrap}>
                  <h2>진행중</h2>
                  <div className={styles.studyListBox}>
                    {study ? (
                      study.map((item, index) => (
                        <div className={styles.item} key={index}>
                          <div className={styles.waiting}>
                            <p>
                              대기
                              <span>
                                {
                                  item.member_id.filter((item) => {
                                    return item.waiting == false;
                                  }).length
                                }
                              </span>
                            </p>
                          </div>
                          <div className={styles.desc}>
                            <p>{item.title}</p>
                            {item.master === email && (
                              <button
                                onClick={async (e) => {
                                  e.preventDefault();
                                  if (item._id !== "") {
                                    const res = await axios.put(
                                      `http://localhost:8080/api/study/studySuccess/${item._id}`,
                                      {},
                                      config
                                    );
                                    console.log(res);
                                    alert(`${item.title}이 완료되었습니다.`);
                                    router.push("/");
                                  }
                                  console.log(item._id);
                                }}
                              >
                                완료하기
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.loading}>Loading...</p>
                    )}
                  </div>
                </div>

                <div className={styles.listWrap}>
                  <h2>완료</h2>
                  <div className={styles.studyListBox}>
                    {studyComplete ? (
                      studyComplete.map((item, index) => (
                        <div className={styles.item} key={index}>
                          <div className={styles.desc}>
                            <p>{item.title}</p>
                            <div className={styles.btns1}>
                              <button>팀원평가</button>
                              {/* <button>수정</button> */}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.loading}>Loading...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.sideBg}></div>
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
export default connect(getState)(index);

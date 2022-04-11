import styles from "./style/style.module.css";
import Nav from "../../components/nav/Nav";
import Link from "next/link";
import StudyGradeModal from "../../components/studyGradeModal/StudyGradeModal";
import ProjectWaitingModal from "../../components/projectWaitingModal/ProjectWaitingModal";
import StudyWaitingModal from "../../components/studyWaitingModal/StudyWaitingModal";
import ProjectGradeModal from "../../components/projectGradeModal/ProjectGradeModal";
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
  const [waiting, setWaiting] = useState(false); // project modal display
  const [studyWaiting, setStudyWaiting] = useState(false); // study modal display
  const [waitData, setWaitData] = useState(false); // project wait data
  const [studyWaitData, setStudyWaitData] = useState(false); // study wait data
  const [myProject, setMyProject] = useState(null); //내가 참여하고있는 프로젝트
  const [mySuccessProject, setMySuccessProject] = useState(null); //내가 참여했던 프로젝트
  const [myStudy, setMyStudy] = useState(null); //내가 참여하고있는 프로젝트
  const [mySuccessStudy, setMySuccessStudy] = useState(null); //내가 참여했던 프로젝트
  const [projectGrade, setProjectGrade] = useState(false); // project 점수 modal
  const [studyGrade, setStudyGrade] = useState(false); // study 점수 modal
  const [projectGradeItem, setProjectGradeItem] = useState(null); // project 정보
  const [studyGradeItem, setStudyGradeItem] = useState(null); // study 정보
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
    // console.log(email);
  }, [cookies.accessToken, email]);

  useEffect(() => {
    if (state.user) {
      setUser(state.user.decode.email);
    }
    if (cookies.accessToken) {
      const getProject = async () => {
        const projectRes = await axios.get(
          "https://sy-study-app.herokuapp.com/api/project/getProject"
        );
        // console.log(projectRes);

        const studyRes = await axios.get(
          "https://sy-study-app.herokuapp.com/api/study/getStudy"
        );
        const progressData = projectRes.data;
        const studyData = studyRes.data;
        const progressSet = (item) => {
          for (let i = 0; i < 6; i++) {
            return (
              item.success === false &&
              item.master === email &&
              item.member_id.filter((item) => {
                return item.user === email && item.waiting === true;
              })
            );
          }
        };
        const completeSet = (item) => {
          for (let i = 0; i < 6; i++) {
            return (
              item.success === true &&
              item.master === email &&
              item.member_id.filter((item) => {
                return item.user === email && item.waiting === true;
              })
            );
          }
        };

        const progress = await progressData.filter((item) => {
          return progressSet(item);
        });
        // console.log(progress);
        const complete = await progressData.filter((item) => {
          return completeSet(item);
        });
        // console.log(complete);
        const studyProgress = await studyData.filter((item) => {
          return progressSet(item);
        });

        const studyComplete = await studyData.filter((item) => {
          return completeSet(item);
        });

        setProject(progress);
        setProjectComplete(complete); //member_id에 포함되어있는 id인지 걸러야함
        setStudy(studyProgress);
        setStudyComplete(studyComplete);
      };

      getProject(); //내가 작성한 프로젝트
    }
  }, [user, state.user, email, cookies.accessToken]);

  useEffect(() => {
    if (cookies.accessToken) {
      const email = cookies.accessToken.decode.email;
      const getMyProject = async () => {
        const participate = await axios.post(
          "https://sy-study-app.herokuapp.com/api/project/myProject",
          { email: email }
        );

        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMyProject(myProject);
      };
      getMyProject();

      const mySuccessProject = async () => {
        const participate = await axios.post(
          "https://sy-study-app.herokuapp.com/api/project/mySuccessProject",
          { email: email }
        );
        // console.log(participate);
        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMySuccessProject(myProject);
      };
      mySuccessProject();
      const getMyStudy = async () => {
        const participate = await axios.post(
          "https://sy-study-app.herokuapp.com/api/study/myStudy",
          { email: email }
        );

        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMyStudy(myProject);
      };
      getMyStudy();

      const mySuccessStudy = async () => {
        const participate = await axios.post(
          "https://sy-study-app.herokuapp.com/api/study/mySuccessStudy",
          { email: email }
        );

        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMySuccessStudy(myProject);
      };
      mySuccessStudy(); //내가 참여한
    }
  }, [cookies.accessToken]);
  return (
    <>
      <Seo title={"Studyapp-work"} />
      <ProjectGradeModal
        setModalBg={setModalBg}
        projectGrade={projectGrade}
        setProjectGrade={setProjectGrade}
        projectGradeItem={projectGradeItem}
      />
      <StudyGradeModal
        setModalBg={setModalBg}
        setStudyGrade={setStudyGrade}
        studyGrade={studyGrade}
        studyGradeItem={studyGradeItem}
      />
      <div
        className={styles.modalBg}
        style={{ display: `${modalBg ? "block" : "none"}` }}
        onClick={() => {
          setModalBg(false);
          setUrlModal(false);
          setWaiting(false);
          setProjectGrade(false);
          setStudyGrade(false);
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
              <ProjectWaitingModal
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
                    {myProject
                      ? myProject.map((item, index) => (
                          <div className={styles.item} key={index}>
                            <div className={styles.desc}>
                              <p>{item.title}</p>
                            </div>
                          </div>
                        ))
                      : ""}
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
                    {mySuccessProject
                      ? mySuccessProject.map((item, index) => (
                          <div className={styles.item} key={index}>
                            <div className={styles.desc}>
                              <p>{item.title}</p>
                              <div className={styles.btns1}>
                                {item.member_id.filter((item) => {
                                  return (
                                    item.user === email && item.grade === false
                                  );
                                })[0] !== undefined ? (
                                  <button
                                    onClick={() => {
                                      setProjectGrade(true);
                                      setModalBg(true);
                                      setProjectGradeItem(item);
                                    }}
                                  >
                                    팀원평가
                                  </button>
                                ) : (
                                  ""
                                )}

                                {item.url ? (
                                  <Link href={item.url}>URL</Link>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      : ""}

                    {projectComplete ? (
                      projectComplete.map((item, index) => (
                        <div className={styles.item} key={index}>
                          <div className={styles.desc}>
                            <p>{item.title}</p>
                            <div className={styles.btns1}>
                              {item.member_id.filter((item) => {
                                return (
                                  item.user === email && item.grade === false
                                );
                              })[0] !== undefined ? (
                                <button
                                  onClick={() => {
                                    setProjectGrade(true);
                                    setModalBg(true);
                                    setProjectGradeItem(item);
                                  }}
                                >
                                  팀원평가
                                </button>
                              ) : (
                                ""
                              )}

                              {item.url ? <Link href={item.url}>URL</Link> : ""}
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
              <StudyWaitingModal
                setModalBg={setModalBg}
                waitData={studyWaitData}
                waiting={studyWaiting}
                setStudyWaiting={setStudyWaiting}
              />
              <div
                className={styles.listCon}
                style={{ display: boxDisplay ? "none" : "block" }}
              >
                <div className={styles.listWrap}>
                  <h2>진행중</h2>
                  <div className={styles.studyListBox}>
                    {myStudy
                      ? myStudy.map((item, index) => (
                          <div className={styles.item} key={index}>
                            <div className={styles.desc}>
                              <p>{item.title}</p>
                            </div>
                          </div>
                        ))
                      : ""}
                    {study ? (
                      study.map((item, index) => (
                        <div className={styles.item} key={index}>
                          <div className={styles.waiting}>
                            <p
                              onClick={() => {
                                setStudyWaitData(item);
                                setModalBg(true);
                                setStudyWaiting(true);
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
                                onClick={async (e) => {
                                  e.preventDefault();
                                  if (item._id !== "") {
                                    const res = await axios.put(
                                      `https://sy-study-app.herokuapp.com/api/study/studySuccess/${item._id}`,
                                      {},
                                      config
                                    );
                                    console.log(res);
                                    alert(`${item.title}이 완료되었습니다.`);
                                    window.location.reload();
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
                    {mySuccessStudy
                      ? mySuccessStudy.map((item, index) => (
                          <div className={styles.item} key={index}>
                            <div className={styles.desc}>
                              <p>{item.title}</p>
                              <div className={styles.btns1}>
                                {item.member_id.filter((item) => {
                                  return (
                                    item.user === email && item.grade === false
                                  );
                                })[0] !== undefined ? (
                                  <button
                                    onClick={() => {
                                      setStudyGrade(true);
                                      setModalBg(true);
                                      setStudyGradeItem(item);
                                    }}
                                  >
                                    팀원평가
                                  </button>
                                ) : (
                                  "😀"
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      : ""}
                    {studyComplete ? (
                      studyComplete.map((item, index) => (
                        <div className={styles.item} key={index}>
                          <div className={styles.desc}>
                            <p>{item.title}</p>
                            <div className={styles.btns1}>
                              {item.member_id.filter((item) => {
                                return (
                                  item.user === email && item.grade === false
                                );
                              })[0] !== undefined ? (
                                <button
                                  onClick={() => {
                                    setStudyGrade(true);
                                    setModalBg(true);
                                    setStudyGradeItem(item);
                                  }}
                                >
                                  팀원평가
                                </button>
                              ) : (
                                "😀"
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

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
  console.log(projectGradeItem);
  // console.log(studyGradeItem);

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
        };

        /* 
        
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

  useEffect(() => {
    if (cookies.accessToken) {
      const email = cookies.accessToken.decode.email;
      const getMyProject = async () => {
        const participate = await axios.post(
          "http://localhost:8080/api/project/myProject",
          { email: email }
        );

        console.log(participate);
        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMyProject(myProject);
      };
      getMyProject();

      const mySuccessProject = async () => {
        const participate = await axios.post(
          "http://localhost:8080/api/project/mySuccessProject",
          { email: email }
        );

        console.log(participate);
        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMySuccessProject(myProject);
      };
      mySuccessProject();
      const getMyStudy = async () => {
        const participate = await axios.post(
          "http://localhost:8080/api/study/myStudy",
          { email: email }
        );

        console.log(participate);
        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMyStudy(myProject);
      };
      getMyStudy();

      const mySuccessStudy = async () => {
        const participate = await axios.post(
          "http://localhost:8080/api/study/mySuccessStudy",
          { email: email }
        );

        console.log(participate);
        const myProject = participate.data.filter((item) => {
          return item.master !== email;
        });
        setMySuccessStudy(myProject);
      };
      mySuccessStudy();
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
                                <button
                                  onClick={() => {
                                    setProjectGrade(true);
                                    setModalBg(true);
                                    setProjectGradeItem(item);
                                  }}
                                >
                                  팀원평가
                                </button>
                                <Link href={item.url}>URL</Link>
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
                              <button
                                onClick={() => {
                                  setProjectGrade(true);
                                  setModalBg(true);
                                  setProjectGradeItem(item);
                                }}
                              >
                                팀원평가
                              </button>
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
                                      `http://localhost:8080/api/study/studySuccess/${item._id}`,
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
                                <button
                                  onClick={() => {
                                    setStudyGrade(true);
                                    setModalBg(true);
                                    setStudyGradeItem(item);
                                  }}
                                >
                                  팀원평가
                                </button>
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
                              <button
                                onClick={() => {
                                  setStudyGrade(true);
                                  setModalBg(true);
                                  setStudyGradeItem(item);
                                }}
                              >
                                팀원평가
                              </button>
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

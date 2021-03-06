import styles from "./style/style.module.css";
import Nav from "../../components/nav/Nav";
import Link from "next/link";

import { useState, useEffect } from "react";
import Seo from "../../components/Seo";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
const index = ({ state }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [config, setConfig] = useState();
  const [user, setUser] = useState("");

  // useEffect(() => {
  //   if (state.user) {
  //     setUser(state.user.decode.email);
  //   }
  // }, [state, state.user]);
  useEffect(() => {
    if (cookies.accessToken) {
      setUser(cookies.accessToken.decode.email);
    }
  }, [cookies.accessToken, user]);

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

  const router = useRouter();
  const [tpye, setType] = useState("Project");
  const tpyeSelect = (e) => {
    setType(e.target.value);
  };

  const [data, setData] = useState({});

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const projectData = {
    area: data.area,
    deadline: data.deadline,
    headCount: data.headCount,
    language: data.language,
    meet: data.meet,
    text: data.text,
    title: data.title,
    master: user,
    desc: data.text,
  };

  const studyData = {
    area: data.area,

    headCount: data.headCount,
    language: data.language,
    meet: data.meet,
    text: data.text,
    title: data.title,
    master: user,
  };

  const formHandle = async (e) => {
    e.preventDefault();
    if (tpye === "Project") {
      // alert("Project");
      if (
        projectData.area !== undefined &&
        projectData.deadline !== undefined &&
        projectData.headCount !== undefined &&
        projectData.language !== undefined &&
        projectData.meet !== undefined &&
        projectData.title !== undefined &&
        projectData.master !== undefined
      ) {
        if (user !== undefined) {
          try {
            const res = await axios.post(
              "https://sy-study-app.herokuapp.com/api/project/create",
              projectData,
              config
            );

            if (res) {
              const chatData = {
                title: data.title,
                type: tpye,
                members: [{ email: user }],
                projectId: res.data._id,
              };
              const createChat = await axios.post(
                "https://sy-study-app.herokuapp.com/api/chat/create",
                chatData,

                config
              );
            }
          } catch (err) {
            console.log(err);
            return alert("???????????? ???????????? ????????? ?????????????????????.");
          }

          router.push("/Work");
        }
      } else {
        alert("????????? ?????? ??????????????????.");
        return;
      }
    }
    if (tpye === "Study") {
      // alert("Study");
      if (
        studyData.area !== undefined &&
        studyData.headCount !== undefined &&
        studyData.language !== undefined &&
        studyData.meet !== undefined &&
        studyData.title !== undefined &&
        studyData.master !== undefined
      ) {
        if (user !== undefined) {
          try {
            const res = await axios.post(
              "https://sy-study-app.herokuapp.com/api/study/create",
              studyData,
              config
            );

            if (res) {
              const chatData = {
                title: data.title,
                type: tpye,
                members: [{ email: user }],
                projectId: res.data._id,
              };
              const createChat = await axios.post(
                "https://sy-study-app.herokuapp.com/api/chat/create",
                chatData,

                config
              );
            }
          } catch (err) {
            console.log(err);
            return alert("???????????? ???????????? ????????? ?????????????????????.");
          }

          router.push("/Work");
        }
      } else {
        alert("????????? ?????? ??????????????????.");
        return;
      }
    }
  };
  return (
    <>
      <Seo title={"Studyapp-create"} />
      <Nav />
      <div className={styles.container}>
        <div className={styles.aside}>
          <h2>Create</h2>
          <div className={styles.asideWrap}>
            <form onSubmit={formHandle}>
              <div className={styles.createForm}>
                <div className={styles.createInputs}>
                  <div className={styles.inputBox}>
                    <label>Type :</label>
                    <select
                      name="tpyeSelect"
                      onChange={tpyeSelect}
                      className={styles.selectBox}
                    >
                      <option>Project</option>
                      <option>Study</option>
                    </select>
                  </div>
                  {tpye === "Project" && (
                    <div className={styles.inputBox}>
                      <label>?????? :</label>
                      <select
                        name="deadline"
                        className={styles.selectBox}
                        onChange={inputHandle}
                      >
                        <option></option>
                        <option>1???</option>
                        <option>2???</option>
                        <option>3???</option>
                        <option>4???</option>
                        <option>5???</option>
                        <option>6???</option>
                        <option>1???</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className={styles.createInputs}>
                  <div className={styles.inputBox1}>
                    <label>Title : </label>
                    <input
                      type="text"
                      className={styles.input}
                      name="title"
                      onChange={inputHandle}
                    />
                  </div>
                </div>
                <div className={styles.createInputs}>
                  <div className={styles.inputBox2}>
                    <label>Language : </label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="ex)node, java"
                      name="language"
                      onChange={inputHandle}
                    />
                    <label>?????? :</label>
                    <select
                      name="area"
                      className={styles.selectBox}
                      onChange={inputHandle}
                    >
                      <option></option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                      <option>??????</option>
                    </select>
                  </div>
                </div>
                <div className={styles.createInputs}>
                  <div className={styles.inputBox}>
                    <label>Meet :</label>
                    <select
                      className={styles.selectBox}
                      name="meet"
                      onChange={inputHandle}
                    >
                      <option></option>
                      <option>??????</option>
                      <option>?????????</option>
                    </select>
                  </div>
                  <div className={styles.inputBox}>
                    <label>?????? :</label>
                    <select
                      name="headCount"
                      className={styles.selectBox}
                      onChange={inputHandle}
                    >
                      <option></option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </div>
                </div>
                {tpye === "Project" && (
                  <div className={styles.createInputs}>
                    <div className={styles.inputBox1}>
                      <label>Text : </label>
                      <textarea
                        className={styles.textarea}
                        name="text"
                        onChange={inputHandle}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.btns}>
                  <button type="submit">????????????</button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/Work");
                    }}
                  >
                    ??????
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.sideBg}></div>
      </div>
    </>
  );
};

const getState = ({ userReducer }) => {
  return {
    state: userReducer,
  };
};
export default connect(getState)(index);

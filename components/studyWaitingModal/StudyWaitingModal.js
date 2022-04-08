import styles from "./style/style.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useCookies } from "react-cookie";
const index = ({ setModalBg, waiting, setStudyWaiting, waitData }) => {
  const [config, setConfig] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies();
  const [member, setMember] = useState([]);
  const [memberTrue, setMemberTrue] = useState([]); //waiting 이 true인사람
  const [projectId, setProjectId] = useState("");
  const [headCount, setHeadCount] = useState();
  const [match, setMatch] = useState();
  useEffect(() => {
    if (cookies.accessToken) {
      const accessToken = cookies.accessToken.user;
      const config = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
      setConfig(config);
    }
  }, [cookies.accessToken]);
  useEffect(() => {
    // console.log(waitData);
    // console.log(waitData._id);
    if (waitData) {
      setProjectId(waitData._id);
    }
    if (waitData.member_id) {
      const members = waitData.member_id.filter((item) => {
        return item.waiting === false;
      });
      const membersTrue = waitData.member_id.filter((item) => {
        return item.waiting === true;
      });
      setMember(members);
      setMemberTrue(membersTrue.length);
    }
    if (waitData.headCount) {
      setHeadCount(waitData.headCount);
    }
  }, [waitData]);

  const refuseHandle = async (user) => {
    if (user) {
      console.log(user);
      try {
        const res = await axios.post(
          `http://localhost:8080/api/study/refuse/${projectId}`,
          { email: user },
          config
        );
        console.log(res.data);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  }; //거절
  const acceptHandle = async (user) => {
    if (user) {
      console.log(user);
      try {
        const res = await axios.post(
          `http://localhost:8080/api/study/accept/${projectId}`,
          { email: user },
          config
        );
        console.log(res.data);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  }; //수락
  useEffect(() => {
    if (memberTrue) {
      if (headCount) {
        setMatch(Number(memberTrue) === Number(headCount));
      }
    }
  }, [memberTrue, headCount]);
  console.log(memberTrue, headCount, match);
  return (
    <div
      className={styles.gradeBox}
      style={{ display: waiting ? "block" : "none" }}
    >
      <div
        className={styles.xicon}
        onClick={() => {
          setModalBg(false);
          setStudyWaiting(false);
        }}
      >
        <Image width={25} height={25} src={"/assets/img/icon/x-icon1.png"} />
      </div>
      <h2>대기자</h2>

      <div className={styles.gradeCon}>
        {member
          ? member.map((item, index) => (
              <div key={index}>
                <div className={styles.gradeForm}>
                  <span>
                    <Link href="/">{item.user}</Link>
                  </span>
                  {match ? (
                    ""
                  ) : (
                    <div className={styles.btn1}>
                      <button
                        onClick={() => {
                          if (item.user) {
                            acceptHandle(item.user);
                          }

                          // alert(item.user);
                        }}
                      >
                        수락
                      </button>
                      <button
                        onClick={() => {
                          if (item.user) {
                            refuseHandle(item.user);
                          }

                          // alert(item.user);
                        }}
                      >
                        거절
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default index;

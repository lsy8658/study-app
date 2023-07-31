import React, { useEffect, useState } from "react";
import Nav from "../../components/nav/Nav";
import styles from "./style/style.module.css";
import Image from "next/image";
import axios from "axios";
// import Chat from "../../components/chat/Chat";
const index = () => {
  const [newProject, setNewProject] = useState([]);
  const [newStudy, setNewStudy] = useState([]);
  useEffect(() => {
    const newPro = async () => {
      try {
        const res = await axios.get(
          "https://port-0-study-app-server-ac2nlkqinq1x.sel4.cloudtype.app/api/project/newProject"
        );
        setNewProject(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    newPro();
    const newStu = async () => {
      try {
        const res = await axios.get(
          "https://port-0-study-app-server-ac2nlkqinq1x.sel4.cloudtype.app/api/study/newStudy"
        );
        setNewStudy(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    newStu();
  }, []);

  return (
    <>
      <Nav />
      <div className={styles.container}>
        {/* <Chat /> */}
        <div className={styles.aside}>
          <h1>Project &#38; Study</h1>
          <h2>오늘의 스터디</h2>
          <div className={styles.studyRooms}>
            {newProject &&
              newProject.map((item, index) => {
                const members = item.member_id.filter((member) => {
                  return member.waiting === true;
                });

                return (
                  <div className={styles.studyRoom} key={index}>
                    <div className={styles.studyType}>
                      <span>Project</span>
                    </div>
                    <div className={styles.studyInfo}>
                      <div className={styles.studyTitle}>
                        <p>{item.title}</p>
                      </div>
                      <div className={styles.studyMember}>
                        <p>
                          <span>
                            {members.length}/ {item.headCount}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.studyRooms}>
            {newStudy &&
              newStudy.map((item, index) => {
                const members = item.member_id.filter((member) => {
                  return member.waiting === true;
                });

                return (
                  <div className={styles.studyRoom} key={index}>
                    <div className={styles.studyType}>
                      <span>Study</span>
                    </div>
                    <div className={styles.studyInfo}>
                      <div className={styles.studyTitle}>
                        <p>{item.title}</p>
                      </div>
                      <div className={styles.studyMember}>
                        <p>
                          <span>
                            {members.length}/ {item.headCount}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={styles.mainBox}>
          <div className={styles.mainBg}>
            <Image
              src={"/assets/img/bg/3.jpg"}
              alt=""
              width={200}
              height={300}
              layout="responsive"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

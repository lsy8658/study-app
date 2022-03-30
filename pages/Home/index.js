import React from "react";
import Nav from "../../components/nav/Nav";
import styles from "./style/style.module.css";
import Image from "next/image";

const index = () => {
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.aside}>
          <h1>Project &#38; Study</h1>
          <h2>오늘의 스터디</h2>
          <div className={styles.studyRooms}>
            <div className={styles.studyRoom}>
              <div className={styles.studyType}>
                <span>Project</span>
              </div>
              <div className={styles.studyInfo}>
                <div className={styles.studyTitle}>
                  <p>새로운 sns 작업</p>
                </div>
                <div className={styles.studyMember}>
                  <p>
                    <span>3 / 4</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.studyRoom}>
              <div className={styles.studyType}>
                <span>Project</span>
              </div>
              <div className={styles.studyInfo}>
                <div className={styles.studyTitle}>
                  <p>토이프로젝트 같이하실 분?</p>
                </div>
                <div className={styles.studyMember}>
                  <p>
                    <span>3 / 4</span>
                  </p>
                </div>
              </div>
            </div>
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

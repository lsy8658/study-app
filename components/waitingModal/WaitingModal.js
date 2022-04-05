import styles from "./style/style.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
const index = ({ setModalBg, waiting, setWaiting, waitData }) => {
  const [member, setMember] = useState([]);
  useEffect(() => {
    console.log(waitData);
    if (waitData.member_id) {
      const members = waitData.member_id.filter((item) => {
        return item.waiting === false;
      });
      setMember(members);
    }
  }, [waitData]);
  console.log(member);
  const refuseHandle = () => {}; //거절
  const acceptHandle = () => {}; //수락
  return (
    <div
      className={styles.gradeBox}
      style={{ display: waiting ? "block" : "none" }}
    >
      <div
        className={styles.xicon}
        onClick={() => {
          setModalBg(false);
          setWaiting(false);
        }}
      >
        <Image width={25} height={25} src={"/assets/img/icon/x-icon1.png"} />
      </div>
      <h2>대기자</h2>

      <div className={styles.gradeCon}>
        {member
          ? member.map((item) => (
              <form>
                <div className={styles.gradeForm}>
                  <span>
                    <Link href="/">{item.user}</Link>
                  </span>
                  <span>프론트엔드</span>

                  <div className={styles.btn1}>
                    <button onClick={acceptHandle}>수락</button>
                    <button onClick={refuseHandle}>거절</button>
                  </div>
                </div>
              </form>
            ))
          : ""}
      </div>
    </div>
  );
};

export default index;

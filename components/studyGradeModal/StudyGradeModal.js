import styles from "./style/style.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
const index = ({ setModalBg, setStudyGrade, studyGrade, studyGradeItem }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (cookies.accessToken) {
      const user = cookies.accessToken.decode.email;

      if (studyGradeItem) {
        const memberFilter = studyGradeItem.member_id.filter((item) => {
          return item.user !== user && item.waiting === true;
        });
        setMember(memberFilter);
      }
    }
  }, [studyGradeItem, cookies.accessToken]);
  return (
    <div
      className={styles.gradeBox}
      style={{ display: studyGrade ? "block" : "none" }}
    >
      <div
        className={styles.xicon}
        onClick={() => {
          setStudyGrade(false);
          setModalBg(false);
        }}
      >
        <Image width={25} height={25} src={"/assets/img/icon/x-icon1.png"} />
      </div>
      <h2>팀원 평가</h2>
      <div className={styles.gradeCon}>
        <form>
          <div className={styles.gradeForm}>
            {member
              ? member.map((item, index) => (
                  <div className={styles.gradeItem} key={index}>
                    <span>{item.user}</span>

                    <select
                      className={styles.gradeSelect}
                      style={{ textAlign: "center" }}
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                ))
              : ""}

            <div className={styles.gradeSubmit}>
              <button type="submit">완료하기</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;

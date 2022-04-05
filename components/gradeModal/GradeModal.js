import styles from "./style/style.module.css";
import Image from "next/image";
import { useState } from "react";
const index = ({ setModalBg }) => {
  // const [modal, setModal] = useState(false);
  return (
    <div className={styles.gradeBox}>
      <div
        className={styles.xicon}
        onClick={() => {
          setModalBg(false);
        }}
      >
        <Image width={25} height={25} src={"/assets/img/icon/x-icon1.png"} />
      </div>
      <h2>팀원 평가</h2>
      <div className={styles.gradeCon}>
        <form>
          <div className={styles.gradeForm}>
            <span>65q16</span>
            <span>프론트엔드</span>
            <select className={styles.gradeSelect}>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            <div className={styles.btn1}>
              <button>입력</button>
            </div>
          </div>
        </form>
        <form>
          <div className={styles.gradeForm}>
            <span>65qwqweqwq16</span>
            <span>프론트엔드</span>
            {/* <select className={styles.gradeSelect}>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select> */}
            <span>4</span>
            <div className={styles.btn2}>
              <button>확인</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;

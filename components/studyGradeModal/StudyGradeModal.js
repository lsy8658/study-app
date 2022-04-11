import styles from "./style/style.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
const index = ({ setModalBg, setStudyGrade, studyGrade, studyGradeItem }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [member, setMember] = useState(null);
  const [input, setInput] = useState({});
  const [email, setEmail] = useState("");
  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (cookies.accessToken) {
      const user = cookies.accessToken.decode.email;
      const accessToken = cookies.accessToken.user;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setConfig(config);

      setEmail(user);
      if (studyGradeItem) {
        const memberFilter = studyGradeItem.member_id.filter((item) => {
          return item.user !== user && item.waiting === true;
        });
        setMember(memberFilter);
      }
    }
  }, [studyGradeItem, cookies.accessToken, email]);

  const formHandle = async (e) => {
    e.preventDefault();

    if (Object.keys(input).length === member.length) {
      for (let i = 0; i <= member.length; i++) {
        const userKeys = Object.entries(input);
        let data = userKeys[i];

        if (data) {
          const user = {
            email: data[0],
            grade: data[1],
          };
          if (user) {
            const res = await axios.post(
              "https://sy-study-app.herokuapp.com/api/project/evaluation",
              user,
              config
            );

            console.log(res.data);
          }
        }
      }
      if (studyGradeItem) {
        if (email) {
          const email = {
            email: email,
          };
          const gradeButton = await axios.post(
            `https://sy-study-app.herokuapp.com/api/project/gradeTrue/${studyGradeItem._id}`,
            email,
            config
          );
        }
        window.location.reload();
      } else {
        return;
      }
    } else {
      alert("점수를 모두 입력해주세요.");
    }
  };
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    <div
      className={styles.gradeBox}
      style={{ display: studyGrade ? "block" : "none" }}
    >
      <div
        className={styles.xicon}
        onClick={() => {
          setModalBg(false);
        }}
      >
        <div
          onClick={() => {
            setStudyGrade(false);
          }}
        >
          <Image width={25} height={25} src={"/assets/img/icon/x-icon1.png"} />
        </div>
      </div>
      <h2>팀원 평가</h2>
      <div className={styles.gradeCon}>
        <form onSubmit={formHandle}>
          <div className={styles.gradeForm}>
            {member
              ? member.map((item, index) => (
                  <div className={styles.gradeItem} key={index}>
                    <span>{item.user}</span>

                    <select
                      className={styles.gradeSelect}
                      style={{ textAlign: "center" }}
                      onChange={inputHandle}
                      name={item.user}
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

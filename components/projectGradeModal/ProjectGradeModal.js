import styles from "./style/style.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
const index = ({
  setModalBg,
  setProjectGrade,
  projectGrade,
  projectGradeItem,
}) => {
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
      console.log(accessToken);
      setEmail(user);
      if (projectGradeItem) {
        const memberFilter = projectGradeItem.member_id.filter((item) => {
          return item.user !== user && item.waiting === true;
        });
        setMember(memberFilter);
      }
    }
  }, [projectGradeItem, cookies.accessToken, email]);
  console.log(input);
  const formHandle = async (e) => {
    e.preventDefault();
    console.log(projectGradeItem);

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
              "http://localhost:8080/api/project/evaluation",
              user,
              config
            );

            console.log(res.data);
          }
        }
      }

      if (cookies.accessToken) {
        const email = {
          email: cookies.accessToken.decode.email,
        };

        console.log(email);
        const gradeButton = await axios.post(
          `http://localhost:8080/api/project/gradeTrue/${projectGradeItem._id}`,
          email,
          config
        );
        console.log(gradeButton);
      } else {
        alert("email 에러");
        return;
      }

      window.location.reload();
    } else {
      alert("점수를 모두 입력해주세요.");
      return;
    }
  };
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    <div
      className={styles.gradeBox}
      style={{ display: projectGrade ? "block" : "none" }}
    >
      <div
        className={styles.xicon}
        onClick={() => {
          setModalBg(false);
        }}
      >
        <div
          onClick={() => {
            setProjectGrade(false);
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

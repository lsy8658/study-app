import styles from "./style/style.module.css";
import Nav from "../../components/nav/Nav";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
const index = ({ data }) => {
  console.log(data);

  const [gradeState, setradeState] = useState(); // 작성자 평점
  const [getProject, setGetProject] = useState();
  useEffect(() => {
    if (data) {
      if (data.grade !== "") {
        const grades = data.grade.reduce(
          (prev, curr) => {
            return Number(prev) + Number(curr);
          },
          [0]
        );
        const getGrade = grades / data.grade.length;
        setradeState(getGrade.toFixed(1));
      }

      const projects = async () => {
        const res = await axios.post(
          "https://port-0-study-app-server-ac2nlkqinq1x.sel4.cloudtype.app/api/project/mySuccessProject",
          {
            email: data.email,
          }
        );
        const filterProject = res.data.filter((item) => {
          return item.url !== "";
        });
        setGetProject(filterProject);
      };

      projects();
    }
  }, [data]);
  console.log(getProject);
  return (
    <>
      <Nav />
      <div className={styles.infoContainer}>
        <div className={styles.infoHeader}>
          <h2 className={styles.infoName}>{data.name}</h2>
          <p className={styles.infoGrade}>
            평점 :
            <span
              style={{
                color: gradeState <= 2.5 ? "#fc2b2b" : "#8bec7b",
                marginLeft: "5px",
              }}
            >
              {isNaN(gradeState) !== true ? gradeState : ""}
            </span>
          </p>
        </div>
        <p className={styles.infoTxt}>{data.developer}</p>
        <p className={styles.infoTxt}>E.mail : {data.email}</p>
        <div className={styles.infoProjectCon}>
          <p className={styles.infoProjectTitle}>PROJECT</p>
          <div className={styles.infoProjectWrap}>
            {getProject
              ? getProject.map((item) => (
                  <div className={styles.infoProjectItem}>
                    <p>{item.title}</p>
                    <Link href={`${item.url}`}>Url</Link>
                  </div>
                ))
              : ""}
          </div>
          <div className={styles.backButton}>
            <Link href={"/Work"}>돌아가기</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

export const getServerSideProps = async ({ params }) => {
  console.log(params);

  const res = await axios.post(
    "https://port-0-study-app-server-ac2nlkqinq1x.sel4.cloudtype.app/api/user/getUser",
    {
      email: params.id,
    }
  );

  return {
    props: { data: res.data[0] },
  };
};

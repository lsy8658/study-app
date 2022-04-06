import React, { useEffect, useState } from "react";
import Nav from "../../components/nav/Nav";
import styles from "./style/style.module.css";
import Seo from "../../components/Seo";
import ProjectModal from "../../components/projectModal/ProjectModal";
import axios from "axios";
const index = () => {
  const [getStudy, setGetStudy] = useState([]);
  const [data, setData] = useState();
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const getStudys = async () => {
      const res = await axios.get(
        "http://localhost:8080/api/project/Projecting"
      );
      setGetStudy(res.data);
    };
    getStudys();
  }, []);
  const searchForm = async (e) => {
    e.preventDefault();
    const text = {
      text: search,
    };
    if (search !== "") {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/project/search",
          text
        );
        setGetStudy(res.data);
        console.log(res.data);
        setSearch("");
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/project/Projecting"
        );
        setGetStudy(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <div className={styles.containerBox}>
        <Seo title={"Studyapp - Project"} />
        <Nav />

        <div className={styles.container}>
          <h1>Project</h1>
          <div className={styles.searchBox}>
            <form className={styles.searchForm} onSubmit={searchForm}>
              <input
                type="text"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="전체보기는 search만 눌러주세요."
                value={search}
              />
              <button>Search</button>
            </form>
          </div>
          <ProjectModal modal={modal} setModal={setModal} data={data} />
          <div className={styles.listScroll}>
            <div className={styles.listBox}>
              {getStudy ? (
                getStudy.map((item, index) => {
                  const members = item.member_id.filter((member) => {
                    return member.waiting === true;
                  });

                  return (
                    <div
                      key={index}
                      className={styles.itemBox}
                      onClick={() => {
                        setModal(true);
                        setData(item);
                      }}
                    >
                      <div className={styles.item}>
                        <div className={styles.members}>
                          {members.length}/{item.headCount}
                        </div>
                        <div className={styles.title}>
                          <p>{item.title}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

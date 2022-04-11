import React, { useEffect, useState } from "react";
import Nav from "../../components/nav/Nav";
import styles from "./style/style.module.css";
import Seo from "../../components/Seo";
import StudyModal from "../../components/studyModal/StudyModal";

import axios from "axios";
const index = () => {
  const [modal, setModal] = useState(false);
  const [getStudy, setGetStudy] = useState([]);

  const [data, setData] = useState();
  const [search, setSearch] = useState("");
  const [newGetStudy, setNewGetStudy] = useState([]);
  useEffect(() => {
    const getStudys = async () => {
      const res = await axios.get(
        "https://sy-study-app.herokuapp.com/api/study/Studying"
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
          "https://sy-study-app.herokuapp.com/api/study/search",
          text
        );
        setGetStudy(res.data);

        setSearch("");
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.get(
          "https://sy-study-app.herokuapp.com/api/study/Studying"
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
          <h1>Study</h1>
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
              <button type="submit">Search</button>
            </form>
          </div>
          <StudyModal modal={modal} setModal={setModal} data={data} />
          {/* <p style={{ color: "#9F9C9C" }}>Scroll 해주세요.</p> */}
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

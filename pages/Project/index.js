import React from "react";
import Nav from "../../components/nav/Nav";
import styles from "./style/style.module.css";
import projectModal from "../../components/projectModal/index";
import Seo from "../../components/Seo";
const index = () => {
  return (
    <div className={styles.containerBox}>
      <Seo title={"Studyapp - Project"} />
      <Nav />
      <projectModal />
      <div className={styles.container}>
        <h1>Study</h1>
        <div className={styles.searchBox}>
          <form className={styles.searchForm}>
            <input />
            <button>Search</button>
          </form>
        </div>
        <div className={styles.listScroll}>
          <div className={styles.listBox}>
            <div className={styles.item}>
              <div className={styles.members}>3/4</div>
              <div className={styles.title}>
                <p>
                  새로운 new project새로운 new project새로운 new project새로운
                  new project새로운 new project새로운 new project새로운 new
                  project새로운 new project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;

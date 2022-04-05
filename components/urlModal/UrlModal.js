import styles from "./style/style.module.css";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
const index = ({ setModalBg, urlModal, projectId, setUrlModal }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [url, setUrl] = useState("");
  const [config, setConfig] = useState();
  const router = useRouter();
  const urlHandle = (e) => {
    setUrl(e.target.value);
  };
  useEffect(() => {
    if (cookies.accessToken) {
      const accessToken = cookies.accessToken.user;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setConfig(config);
    }
  }, [cookies.accessToken]);
  const urlForm = async (e) => {
    e.preventDefault();
    let sliceClg = url.slice(0, 4);
    console.log(sliceClg);
    if (sliceClg === "http" && projectId !== "") {
      try {
        const res = await axios.put(
          `http://localhost:8080/api/project/updateUrl/${projectId}`,
          { url: url },
          config
        );
        console.log(res);
        alert("해당 프로젝트가 완료되었습니다.");
      } catch (err) {
        console.log(err);
      }
      console.log(projectId);
      router.push("/");
    } else {
      alert("url을 다시 확인해주세요.");
    }
  };

  return (
    <div
      className={styles.urlBox}
      style={{ display: urlModal ? "block" : "none" }}
    >
      <div
        className={styles.xicon}
        onClick={() => {
          setModalBg(false);
          setUrlModal(false);
        }}
      >
        <Image width={25} height={25} src={"/assets/img/icon/x-icon1.png"} />
      </div>
      <h2 style={{ color: "white" }}>고생하셨습니다 ^^</h2>
      <div className={styles.urlCon}>
        <p>
          마무리 하기전에 URL을 추가하시겠습니까? URL 추가는 프로젝트 확인에
          도움이 됩니다.
        </p>

        <form className={styles.urlForm} onSubmit={urlForm}>
          <input
            placeholder="url을 입력해주세요. 시작은(http)"
            className={styles.urlInput}
            onChange={urlHandle}
            // style={{ fontSize: "15px" }}
          />
          <div className={styles.btns}>
            <button type="submit">입력 완료</button>
            <button
              onClick={() => {
                setModalBg(false);
                setUrlModal(false);
              }}
            >
              추가 안함
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;

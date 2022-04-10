import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import styles from "./style/style.module.css";
import { useCookies } from "react-cookie";
import axios from "axios";
const socket = io.connect("http://localhost:8080");

const index = () => {
  const [email, setEmail] = useState("");
  const [config, setConfig] = useState();
  const [chatIcon, setChatIcon] = useState(true); //chat icon
  const [chatList, setChatList] = useState(false); //list 열기
  const [chatRoom, setChatRoom] = useState(false); //chatting room 열기
  const [getChatList, setGetChatList] = useState([]); //list 데이터
  const [cookies, setCookie, removeCookie] = useCookies();

  const handlePost = (e) => {};
  useEffect(() => {
    if (cookies.accessToken) {
      setEmail(cookies.accessToken.decode.email);
      const accessToken = cookies.accessToken.user;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setConfig(config);
    }
  }, [cookies.accessToken]);

  useEffect(() => {
    const getChatList = async () => {
      if (email !== undefined && config !== undefined) {
        try {
          const chatList = await axios.post(
            "http://localhost:8080/api/chat/getList",
            {
              email: email,
            },
            config
          );
          setGetChatList(chatList.data);
          console.log(chatList);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getChatList();
  }, [email]);

  const chatHandle = (e) => {
    e.preventDefault();
  };
  console.log(getChatList);
  return (
    <div className={styles.chatCon}>
      <div
        className={styles.chatIcon}
        style={{ display: chatIcon ? "block" : "none" }}
        onClick={() => {
          setChatList(true);
          setChatIcon(false);
          setChatRoom(false);
          const getChatList = async () => {
            if (email !== undefined && config !== undefined) {
              try {
                const chatList = await axios.post(
                  "http://localhost:8080/api/chat/getList",
                  {
                    email: email,
                  },
                  config
                );
                setGetChatList(chatList.data);
              } catch (err) {
                console.log(err);
              }
            }
          };
          getChatList();
        }}
      >
        <Image src={"/assets/img/icon/chat1.png"} width={50} height={50} />
      </div>
      <div
        className={styles.chatList}
        style={{ display: chatList ? "block" : "none" }}
      >
        <div className={styles.xIcon}>
          <Image
            src={"/assets/img/icon/x-icon2.png"}
            width={25}
            height={25}
            onClick={() => {
              setChatIcon(true);
              setChatList(false);
              setChatRoom(false);
            }}
          />
        </div>
        <h3>Chat List</h3>
        <div className={styles.chatListWrap}>
          {getChatList
            ? getChatList.map((list, index) => (
                <div
                  className={styles.chatListItem}
                  onClick={() => {
                    setChatList(false);
                    setChatIcon(false);
                    setChatRoom(true);
                  }}
                  key={index}
                >
                  <div className={styles.chatListItemTxt}>
                    <p>{list.title}</p>
                    <small>{list.type}</small>
                  </div>
                </div>
              ))
            : ""}
          {getChatList
            ? getChatList.map((list, index) => (
                <div
                  className={styles.chatListItem}
                  onClick={() => {
                    setChatList(false);
                    setChatIcon(false);
                    setChatRoom(true);
                  }}
                  key={index}
                >
                  <div className={styles.chatListItemTxt}>
                    <p>{list.title}</p>
                    <small>{list.type}</small>
                  </div>
                </div>
              ))
            : ""}
          {getChatList
            ? getChatList.map((list, index) => (
                <div
                  className={styles.chatListItem}
                  onClick={() => {
                    setChatList(false);
                    setChatIcon(false);
                    setChatRoom(true);
                  }}
                  key={index}
                >
                  <div className={styles.chatListItemTxt}>
                    <p>{list.title}</p>
                    <small>{list.type}</small>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>

      <div
        className={styles.chatRoom}
        style={{ display: chatRoom ? "block" : "none" }}
      >
        <div className={styles.xIcon}>
          <Image
            src={"/assets/img/icon/x-icon2.png"}
            width={25}
            height={25}
            onClick={() => {
              setChatIcon(false);
              setChatList(true);
              setChatRoom(false);
            }}
          />
        </div>
        <div className={styles.chatRoomWrap}>
          <div className={styles.chatWindow}>
            <div className={`${styles.chatItem} ${styles.left}`}>
              <div className={styles.desc}>
                <span>test1</span>
                <p>
                  asdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </p>
                <small>2022-01-05 00:00</small>
              </div>
            </div>
            <div className={`${styles.chatItem} ${styles.right}`}>
              <div className={styles.desc}>
                <span>test2</span>
                <p>asd</p>
                <small>2022-01-05 00:00</small>
              </div>
            </div>
          </div>
        </div>
        <form className={styles.chatForm} onSubmit={chatHandle}>
          <input type="text" className={styles.chatInput} />
          <button className={styles.chatButton} type="submit">
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default index;

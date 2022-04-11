import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import styles from "./style/style.module.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
const socket = io.connect("https://sy-study-app.herokuapp.com/");

const index = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [config, setConfig] = useState();
  const [chatIcon, setChatIcon] = useState(true); //chat icon
  const [chatList, setChatList] = useState(false); //list 열기
  const [chatRoom, setChatRoom] = useState(false); //chatting room 열기
  const [getChatList, setGetChatList] = useState([]); //list 데이터
  const [cookies, setCookie, removeCookie] = useCookies();
  const [chat, setChat] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [chatData, setChatData] = useState([]);

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
            "https://sy-study-app.herokuapp.com/api/chat/getList",
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
      if (email !== undefined) {
        try {
          const data = await axios.post(
            "https://sy-study-app.herokuapp.com/api/user/getUser",
            {
              email: email,
            }
          );
          if (data.data[0]) {
            setUsername(data.data[0].name);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    getChatList();
  }, [email]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });
  }, [socket, messageList]);
  const sendMessage = async (e) => {
    e.preventDefault();

    if (chat !== "" && username !== undefined && email !== undefined) {
      const hours = new Date(Date.now()).getHours();
      const minutes = new Date(Date.now()).getMinutes();
      const param = {
        name: username,
        chat: chat,
        email: email,
        room: roomId,
        time: `${hours < 0 ? `0${hours}` : hours}:${
          minutes < 0 ? `0${minutes}` : minutes
        }`,
      };
      try {
        const sendChat = await axios.post(
          "https://sy-study-app.herokuapp.com/api/chat/sendChat",
          param,
          config
        );
        console.log(sendChat);
      } catch (err) {
        console.log(err);
      }
      await socket.emit("send_message", param);
      setMessageList((list) => [...list, param]);
      setChat("");
    }
  }; //채팅 보내기

  const joinRoom = (roomId) => {
    setRoomId(roomId);
    if (username !== undefined && email !== undefined) {
      socket.emit("join_room", roomId);
    }
  }; //room 입장

  useEffect(() => {
    if (roomId !== undefined && getChatList !== undefined) {
      const chatData = getChatList.filter((item) => {
        return item.projectId === roomId;
      });
      if (chatData[0] !== undefined) {
        setChatData(chatData[0].chat);
      }
    }
  }, [roomId, getChatList]);
  // console.log(chatData); //chat 데이터만 가져오기
  const roomOut = () => {
    socket.emit("out_room", roomId);
    setMessageList([]);
  };
  const getListData = async () => {
    if (email !== undefined && config !== undefined) {
      try {
        const chatList = await axios.post(
          "https://sy-study-app.herokuapp.com/api/chat/getList",
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
                  "https://sy-study-app.herokuapp.com/api/chat/getList",
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
                    joinRoom(list.projectId);
                    getListData();
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
              roomOut();
            }}
          />
        </div>
        {/* getChatList */}
        <div className={styles.chatRoomWrap}>
          <ScrollToBottom className={styles.chatWindow}>
            {chatData !== undefined &&
              chatData.map((item, index) => {
                return (
                  <div
                    className={`${styles.chatItem} ${
                      item.email === email ? styles.left : styles.right
                    }`}
                    key={index}
                  >
                    <div className={styles.desc}>
                      <span>{item.name}</span>
                      <p>{item.chat}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                );
              })}
            {messageList !== undefined &&
              messageList.map((item, index) => {
                return (
                  <div
                    className={`${styles.chatItem} ${
                      item.email === email ? styles.left : styles.right
                    }`}
                    key={index}
                  >
                    <div className={styles.desc}>
                      <span>{item.name}</span>
                      <p>{item.chat}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                );
              })}
          </ScrollToBottom>
        </div>
        <form className={styles.chatForm} onSubmit={sendMessage}>
          <input
            type="text"
            className={styles.chatInput}
            onChange={(e) => {
              setChat(e.target.value);
            }}
            value={chat}
          />
          <button
            className={styles.chatButton}
            type="submit"
            onKeyPress={(e) => {
              event.key === "Enter" && sendMessage();
            }}
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default index;

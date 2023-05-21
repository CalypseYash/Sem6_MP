import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = React.createContext({});

const ChatProvider = (props) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo && userInfo.user);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}>
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

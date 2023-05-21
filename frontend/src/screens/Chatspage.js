import { Box } from "@chakra-ui/react";
import { useContext, useState } from "react";
import ChatBox from "../components/Chats/ChatBox";
import MyChats from "../components/Chats/MyChats";
import Navigation from "../components/Chats/Navigation";
import { ChatContext } from "../store/ChatProvider";

const Chatspage = () => {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <Navigation />}
      <Box d='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatspage;

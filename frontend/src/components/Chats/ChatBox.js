import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ChatContext } from "../../store/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems='center'
      flexDir='column'
      p={3}
      w={{ base: "100%", md: "68%" }}
      borderRadius='lg'
      borderWidth='1px'
      bg='white'>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;

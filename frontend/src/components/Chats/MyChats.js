import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { requestFetchChats } from "../../actions/chatActions";
import { ChatContext } from "../../store/ChatProvider";
import ChatLoading from "../UI/ChatLoading";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
   const {
      selectedChat,
      setSelectedChat,
      user,
      chats,
      setChats,
      notification,
   } = useContext(ChatContext);

   const fetchChats = async () => {
      const chats = await requestFetchChats();
      setChats(chats);
   };

   useEffect(() => {
      fetchChats();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fetchAgain]);

   const getSender = (loggedUser, chatUsers) => {
      return loggedUser._id === chatUsers[0]._id
         ? chatUsers[1].name
         : chatUsers[0].name;
   };

   const getNotificationsLength = (chatId) => {
      return notification.reduce((prev, curr) => {
         if (chatId === notification.chat._id) {
            return prev + curr;
         } else {
            return 0;
         }
      });
   };

   return (
      <Box
         d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
         flexDir="column"
         alignItems="center"
         p={3}
         bg="white"
         w={{ base: "100%", md: "31%" }}
         borderRadius="lg"
         borderWidth="1px"
      >
         <Box
            pb={3}
            px={3}
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="Work sans"
            d="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
         >
            My Chats
            <GroupChatModal>
               <Button
                  d="flex"
                  fontSize={{ base: "20px", md: "10px", lg: "17px" }}
                  rightIcon={<AddIcon />}
               >
                  New Group Chat
               </Button>
            </GroupChatModal>
         </Box>

         <Box
            d="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
         >
            {chats ? (
               <Stack overflowY="scroll">
                  {chats.map((chat, i) => (
                     <Box
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                        color={selectedChat === chat ? "white" : "black"}
                        px={3}
                        py={3}
                        borderRadius="lg"
                        key={chat._id}
                     >
                        <Text>
                           {chat.isGroupChat
                              ? chat.chatName
                              : getSender(user, chat.users)}
                        </Text>
                        {chat.lastestMessage && (
                           <Text fontSize="xs">
                              <b>{chat.lastestMessage.sender.name} : </b>
                              {chat.lastestMessage.type == "image"
                                 ? "Image"
                                 : chat.lastestMessage.content.length > 50
                                 ? chat.lastestMessage.content.substring(
                                      0,
                                      51
                                   ) + "..."
                                 : chat.lastestMessage.content}
                           </Text>
                        )}
                     </Box>
                  ))}
               </Stack>
            ) : (
               <ChatLoading />
            )}
         </Box>
      </Box>
   );
};
export default MyChats;

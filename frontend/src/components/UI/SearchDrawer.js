import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { getUsers } from "../../actions/userActions";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { requestAccessChat } from "../../actions/chatActions";
import { ChatContext } from "../../store/ChatProvider";

const SearchDrawer = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { setSelectedChat, setChats, chats } = useContext(ChatContext);

  const searchUsers = async (search) => {
    setLoading(true);
    const users = await getUsers(search);
    setLoading(false);

    setSearchResult(users && users);
  };

  const firstRender = useRef(true);

  useEffect(() => {
    const identifier = setTimeout(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      searchUsers(search);
    }, 500);

    return () => {
      //Before every useEffect function runs the cleanup function runs but won't run before the first time of the useEffect function call
      clearInterval(identifier);
    };
  }, [search]);

  const accessChat = async (userId) => {
    setLoadingChat(true);
    const chat = await requestAccessChat(userId);

    if (!chats.find((c) => c._id === chat._id)) {
      setChats([chat, ...chats]);
    }

    setSelectedChat(chat);
    setLoadingChat(false);
    onClose();
  };

  return (
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
        <DrawerBody>
          <Box d='flex' pb={2}>
            <Input
              placeholder='Search by name or email'
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleUserClick={(userId) => accessChat(userId)}
              />
            ))
          )}
          {loadingChat && <Spinner m1='auto' d='flex' />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;

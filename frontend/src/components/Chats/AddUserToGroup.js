import {
  Box,
  Button,
  FormControl,
  Input,
  ModalFooter,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { addUserInGroup, removeUserFromGroup } from "../../actions/chatActions";
import { getUsers } from "../../actions/userActions";
import { ChatContext } from "../../store/ChatProvider";
import SelectedUserListItem from "../UserAvatar/SelectedUserListItem";
import UserListItem from "../UserAvatar/UserListItem";

const AddUserToGroup = ({ fetchAgain, setFetchAgain }) => {
  const {
    user: loggedUser,
    selectedChat,
    setSelectedChat,
  } = useContext(ChatContext);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const searchUsers = async (search) => {
    setLoading(true);
    const users = await getUsers(search);
    setLoading(false);

    setSearchResult(users && users);
  };

  const addUser = async (userToAdd) => {
    const userExists = selectedChat.users.some(
      (user) => user._id === userToAdd._id
    );

    if (selectedChat.groupAdmin._id !== loggedUser._id) {
      return toast({
        title: "Only admins can add new members",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (userExists) {
      return toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    const data = await addUserInGroup(selectedChat._id, userToAdd._id);
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
  };

  const handleDelete = async (userToDelete) => {
    if (
      selectedChat.groupAdmin._id !== loggedUser._id &&
      userToDelete._id !== loggedUser._id
    ) {
      return toast({
        title: "Only admins can add remove members from group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    const data = await removeUserFromGroup(selectedChat._id, userToDelete._id);
    loggedUser._id === userToDelete._id
      ? setSelectedChat("")
      : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      searchUsers(search);
    }, 500);

    return () => {
      clearInterval(identifier);
    };
  }, [search]);

  return (
    <>
      <FormControl>
        <Input
          placeholder='Add Users eg: John, Piyush,Jane'
          mb={3}
          onChange={(e) => setSearch(e.target.value)}
        />
      </FormControl>

      <Box w='100%' d='flex' flexWrap='wrap'>
        {selectedChat.users?.length > 0 &&
          selectedChat.users?.map((user) => (
            <SelectedUserListItem
              key={user._id}
              user={user}
              handleClick={() => handleDelete(user)}
            />
          ))}
      </Box>

      {loading ? (
        <Spinner m1='auto' d='flex' />
      ) : (
        searchResult
          ?.slice(0, 5)
          .map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleUserClick={addUser}
            />
          ))
      )}

      <ModalFooter>
        <Button colorScheme='red' onClick={() => handleDelete(loggedUser)}>
          Leave Group
        </Button>
      </ModalFooter>
    </>
  );
};

export default AddUserToGroup;

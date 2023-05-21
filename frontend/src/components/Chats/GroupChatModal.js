import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { createGroupChat } from "../../actions/chatActions";
import { getUsers } from "../../actions/userActions";
import { ChatContext } from "../../store/ChatProvider";
import SelectedUserListItem from "../UserAvatar/SelectedUserListItem";
import UserListItem from "../UserAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);

  const { chats, setChats } = useContext(ChatContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const searchUsers = async (search) => {
    setLoading(true);
    const users = await getUsers(search);
    setLoading(false);

    setSearchResult(users && users);
  };

  const addUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    setSelectedUsers((prevState) => [userToAdd, ...prevState]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToDelete._id)
    );
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      searchUsers(search);
    }, 500);

    return () => {
      clearInterval(identifier);
    };
  }, [search]);

  const handleSubmit = async (data) => {
    if (!groupChatName) {
      return toast({
        title: "Please fill the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (selectedUsers.length <= 1) {
      return toast({
        title: "Group must have more than two users",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    setCreateGroupLoading(true);
    const group = await createGroupChat({
      groupName: groupChatName,
      users: JSON.stringify(selectedUsers.map((user) => user._id)),
    });
    setCreateGroupLoading(false);

    onClose();
    setChats((prevState) => [group, ...chats]);
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work Sans'
            d='flex'
            justifyContent='center'>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d='flex' flexDir='column' alignItems='center'>
            <FormControl>
              <Input
                placeholder='Chat Name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder='Add Users eg: John, Piyush,Jane'
                mb={3}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>

            <Box w='100%' d='flex' flexWrap='wrap'>
              {selectedUsers?.length > 0 &&
                selectedUsers?.map((user) => (
                  <SelectedUserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleDelete(user)}
                  />
                ))}
            </Box>

            {loading ? (
              <p>Loading...</p>
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
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              onClick={handleSubmit}
              isLoading={createGroupLoading}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;

import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { ChatContext } from "../../store/ChatProvider";
import SelectedUserListItem from "../UserAvatar/SelectedUserListItem";
import AddUserToGroup from "./AddUserToGroup";
import UpdateGroupName from "./UpdateGroupName";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work Sans'
            d='flex'
            justifyContent='center'>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Update Group Name */}
            <UpdateGroupName
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />

            <AddUserToGroup
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

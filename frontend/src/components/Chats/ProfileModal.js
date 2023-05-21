import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='370px'>
          <ModalHeader
            fontSize='40px'
            fontFamily='Work sans'
            d='flex'
            justifyContent='center'>
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='sapce-between'>
            <Image
              borderRadius='full'
              boxSize='150px'
              src={user.picture}
              alt={user.name}
              marginBottom='18px'
            />
            <Text fontSize={{ base: "28px", md: "30px" }}>
              Email: {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../store/ChatProvider";
import ProfileModal from "../Chats/ProfileModal";
import { getSender } from "../../config/chatsLogic";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { Effect } from "react-notification-badge";

const ProfileDropDown = ({ onOpen }) => {
  const { user, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <Box
      d='flex'
      justifyContent='space-between'
      alignItems='center'
      bg='white'
      w='100%'
      p='5px 10px 5px 10px'
      borderWidth='5px'>
      <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
        <Button variant='ghost' onClick={onOpen}>
          <i className='fa fa-search'></i>
          <Text d={{ base: "none", md: "flex" }} px='4'>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize='2xl' fontFamily='Work sans'>
        Talk-A-Tive
      </Text>
      <Menu>
        <MenuButton p={1}>
          <NotificationBadge
            count={notification.length}
            effect={Effect.scale}
          />
          <BellIcon fontSize='2xl' m={1}></BellIcon>
        </MenuButton>
        <MenuList pl={2}>
          {!notification.length && "No New Messages"}
          {notification.map((notif) => (
            <MenuItem
              key={notif._id}
              onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}>
              {notif.chat.isGroupChat
                ? `New Message in ${notif.chat.chatName}`
                : `New Message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          <Avatar
            size='sm'
            cursor='pointer'
            name={user.name}
            src={user.picture}
          />
        </MenuButton>
        <MenuList>
          <ProfileModal user={user}>
            <MenuItem>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider />
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default ProfileDropDown;

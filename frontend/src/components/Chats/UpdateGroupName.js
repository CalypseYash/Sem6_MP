import { Button, FormControl, Input } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { updateGroupName } from "../../actions/chatActions";
import { ChatContext } from "../../store/ChatProvider";

const UpdateGroupName = ({ fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [loading, setLoading] = useState(false);

  const { selectedChat, setSelectedChat } = useContext(ChatContext);

  const handleClick = async () => {
    if (!groupChatName) return;

    setLoading(true);
    const data = await updateGroupName(selectedChat._id, groupChatName);

    setSelectedChat(data);
    setLoading(false);
    setFetchAgain(!fetchAgain);
    setGroupChatName("");
  };

  return (
    <>
      <FormControl d='flex'>
        <Input
          placeholder='Chat Name'
          mb={3}
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <Button
          variant='solid'
          colorScheme='teal'
          ml={1}
          isLoading={loading}
          onClick={handleClick}>
          Update
        </Button>
      </FormControl>
    </>
  );
};

export default UpdateGroupName;

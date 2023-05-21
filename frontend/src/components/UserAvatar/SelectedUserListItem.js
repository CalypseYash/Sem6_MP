import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const SelectedUserListItem = ({ user, handleClick }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      backgroundColor='purple'
      cursor='pointer'
      color='white'
      onClick={handleClick}>
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default SelectedUserListItem;

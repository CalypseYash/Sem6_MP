import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import ProfileDropDown from "../UI/ProfileDropDown";
import SearchDrawer from "../UI/SearchDrawer";

const Navigation = () => {
  // const [loading, setLoading] = useState(false);
  // const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <ProfileDropDown onOpen={onOpen} />
      <SearchDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Navigation;

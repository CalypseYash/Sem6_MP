import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { uploadImage } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState();
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShow((prevState) => !prevState);
  };

  const signup = async (data) => {
    setLoading(true);
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        "/api/users/signup",
        {
          name,
          email,
          password,
          picture,
        },
        config
      );

      toast({
        title: "Registration Successfull!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      setLoading(false);
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const postDetails = async (pic) => {
    setLoading(true);

    if (pic === undefined) {
      return;
    }

    const data = new FormData();
    data.append("file", pic);
    data.append("upload_preset", "chat_app");
    data.append("cloud_name", "dhyyf1dnu");

    // ulpoad image to cloudinary
    const result = await uploadImage(data);
    setLoading(false);

    if (result.status) {
      setPicture(result.photoUrl);
    }
  };

  const submitHandler = () => {
    if (!name || !email || !password || !confirmPassword) {
      return toast({
        title: "Please add all the required fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (password !== confirmPassword) {
      return toast({
        title: "Password and Confirm password must be the same",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    signup();
  };

  return (
    <VStack spacing='5px'>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Name'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Enter Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Enter Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme='blue'
        width='100%'
        color='white'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}>
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;

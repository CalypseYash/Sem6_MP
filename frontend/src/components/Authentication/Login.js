import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
   const [show, setShow] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const toast = useToast();

   const login = async (data) => {
      setLoading(true);
      const config = {
         header: {
            "Content-Type": "application/json",
         },
      };

      try {
         const response = await axios.post(
            "/api/users/login",
            {
               email,
               password,
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

   const handleClick = () => {
      setShow((prevState) => !prevState);
   };

   const submitHandler = () => {
      if (!email || !password) {
         return toast({
            title: "Please add all the required fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
      }

      login();
   };

   return (
      <VStack spacing="5px">
         <FormControl id="email-login" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
               placeholder="Enter Name"
               onChange={(e) => setEmail(e.target.value)}
               value={email}
            />
         </FormControl>
         <FormControl id="password-login" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
               <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
               />
               <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>

         <Button
            colorScheme="blue"
            width="100%"
            color="white"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
         >
            Login
         </Button>

         <Button
            colorScheme="red"
            variant="solid"
            width="100%"
            onClick={() => {
               setEmail("guest@example.com");
               setPassword("123456");
            }}
         >
            Get Guest Credentials
         </Button>
      </VStack>
   );
};

export default Login;

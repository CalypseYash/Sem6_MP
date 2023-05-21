import axios from "axios";

function config() {
   const user = JSON.parse(localStorage.getItem("userInfo"));

   return {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${user && user.token}`,
      },
   };
}

export const requestAccessChat = async (userId) => {
   try {
      const response = await axios.post("/api/chats", { userId }, config());
      return response?.data?.chat;
   } catch (error) {
      console.log(error.response);
   }
};

export const requestFetchChats = async () => {
   try {
      const response = await axios.get("/api/chats", config());
      return response?.data?.chats;
   } catch (error) {
      console.log(error.response);
   }
};

export const createGroupChat = async (data) => {
   try {
      const response = await axios.post("/api/chats/group", data, config());
      return response?.data?.group;
   } catch (error) {
      console.log(error.response);
   }
};

export const updateGroupName = async (groupId, groupName) => {
   try {
      const response = await axios.patch(
         `/api/chats/group/rename/${groupId}`,
         { groupName },
         config()
      );
      return response?.data?.group;
   } catch (error) {
      console.log(error.response);
   }
};

export const addUserInGroup = async (groupId, userId) => {
   try {
      const response = await axios.patch(
         `/api/chats/group/${groupId}/adduser/${userId}`,
         {},
         config()
      );
      return response?.data?.group;
   } catch (error) {
      console.log(error.response);
   }
};

export const removeUserFromGroup = async (groupId, userId) => {
   try {
      const response = await axios.patch(
         `/api/chats/group/${groupId}/removeuser/${userId}`,
         {},
         config()
      );
      return response?.data?.group;
   } catch (error) {
      console.log(error.response);
   }
};

export const sendMessage = async (chatId, content, type = "text") => {
   try {
      const response = await axios.post(
         `/api/messages/${chatId}`,
         { content, type },
         config()
      );
      return response?.data?.message;
   } catch (error) {
      console.log(error.response);
   }
};

export const getMessages = async (chatId) => {
   try {
      const response = await axios.get(`/api/messages/${chatId}`, config());
      return response?.data?.messages;
   } catch (error) {
      console.log(error.response);
   }
};

const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

function decryption(str) {
   let result = "";

   for (let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);

      // Check if character is a letter
      if (charCode >= 65 && charCode <= 90) {
         // Uppercase letters
         result += String.fromCharCode(((charCode - 65 - 3 + 26) % 26) + 65);
      } else if (charCode >= 97 && charCode <= 122) {
         // Lowercase letters
         result += String.fromCharCode(((charCode - 97 - 3 + 26) % 26) + 97);
      } else {
         // Non-letters
         result += str[i];
      }
   }

   return result;
}

exports.accessChat = catchAsync(async (req, res, next) => {
   // 1. Take the id of the user for whome we want to create a chat aur fetch chats
   const { userId } = req.body;

   // 2. If no userId given return
   if (!userId) return next(new AppError("Please provide a userId", 401));

   // 3.In the Chats model we need to check the authenticatedUser's id and the given user id
   let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
         { users: { $elemMatch: { $eq: req.user._id } } },
         { users: { $elemMatch: { $eq: userId } } },
      ],
   })
      .populate("users")
      .populate("lastestMessage");

   // 4. Populate the sender from the lastestMessage
   isChat = await User.populate(isChat, {
      path: "lastestMessage.sender",
      select: "name picture email",
   });

   // 5. Check if the chat exits
   if (isChat.length > 0) {
      res.status(200).json({
         success: true,
         chat: isChat[0],
      });
   } else {
      // 6. If the chat does not ezits we will create a new chat
      const chatData = {
         chatName: "sender",
         isGroupChat: false,
         users: [req.user._id, userId],
      };

      try {
         const createdChat = await Chat.create(chatData);

         const FullChat = await Chat.findById(createdChat._id).populate(
            "users"
         );

         res.status(200).json({
            success: true,
            chat: FullChat,
         });
      } catch (error) {
         next(new AppError(error.message, 404));
      }
   }
});

exports.fetchAllChats = catchAsync(async (req, res, next) => {
   // 1. Get all the chats of the auth user
   let chats = Chat.find({ users: { $elemMatch: { $eq: req.user._id } } });
   chats = chats
      .populate("users")
      .populate("groupAdmin")
      .populate("lastestMessage");
   chats = await chats.sort({ updatedAt: -1 });

   // Populate the sender of the lastestMessage
   chats = await User.populate(chats, {
      path: "lastestMessage.sender",
      select: "name picture email",
   });

   console.log(chats);

   let decryptedChats = [];

   for (let i = 0; i < chats.length; i++) {
      if (chats[i].lastestMessage) {
         console.log("hello");
         chats[i].lastestMessage.content = decryption(
            chats[i].lastestMessage.content
         );
         decryptedChats.push(chats[i]);
      } else {
         decryptedChats.push(chats[i]);
      }
   }

   console.log("----------");
   console.log(decryptedChats);

   res.json({
      success: true,
      results: chats.length,
      chats: decryptedChats,
   });
});

exports.createGroupChat = catchAsync(async (req, res, next) => {
   const { users, groupName } = req.body;
   // 1. Check for the users and the group name
   if (!users || !groupName)
      return next(new AppError("Please provide users and group name", 404));

   let parsedUsers = JSON.parse(users);

   // 2. A gruop will not form if there are only two members
   if (parsedUsers.length < 2) {
      return next(
         new AppError("A group group must have more than two members", 404)
      );
   }

   parsedUsers.push(req.user);

   try {
      const groupChat = await Chat.create({
         chatName: groupName,
         isGroupChat: true,
         users: parsedUsers,
         groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
         .populate("users")
         .populate("groupAdmin");

      res.status(201).json({
         success: true,
         usersLength: fullGroupChat.users.length,
         group: fullGroupChat,
      });
   } catch (error) {
      next(new AppError(error.message, 404));
   }
});

exports.renameGroup = catchAsync(async (req, res, next) => {
   const { groupId } = req.params;
   const { groupName } = req.body;

   if (!groupName || !groupId) {
      return next(new AppError("Please provide a group name and group id"));
   }

   const updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      { chatName: groupName },
      { new: true }
   )
      .populate("users")
      .populate("groupAdmin");

   if (!updatedChat)
      return next(new AppError("No group found with this id", 404));

   res.status(200).json({
      success: true,
      group: updatedChat,
   });
});

exports.addUserToGroup = catchAsync(async (req, res, next) => {
   //1. Extract userId from params
   const { groupId, userId } = req.params;

   if (!groupId || !userId) {
      return next(new AppError("Please provide a groupId and userId"));
   }

   // Check if the users already exist in the group
   const doesUserExistInGroup = await Chat.find({
      _id: groupId,
      users: { $elemMatch: { $eq: userId } },
   });

   if (doesUserExistInGroup.length > 0)
      return next(new AppError("The user already exists in the group"));

   // 2. Update the group's users
   const updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      { $push: { users: userId } },
      { new: true }
   )
      .populate("users")
      .populate("groupAdmin");

   if (!updatedChat) {
      return next(new AppError("No group found with this id"));
   }

   res.status(200).json({
      success: true,
      usersLength: updatedChat.users.length,
      group: updatedChat,
   });
});

exports.removeFromGroup = catchAsync(async (req, res, next) => {
   //1. Extract userId from params
   const { groupId, userId } = req.params;

   if (!groupId || !userId) {
      return next(new AppError("Please provide a groupId and userId"));
   }

   // 2. Update the group's users
   const updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      { $pull: { users: userId } },
      { new: true }
   )
      .populate("users")
      .populate("groupAdmin");

   if (!updatedChat) {
      return next(new AppError("No group found with this id"));
   }

   res.status(200).json({
      success: true,
      usersLength: updatedChat.users.length,
      group: updatedChat,
   });
});

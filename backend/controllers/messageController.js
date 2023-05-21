const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

function encryption(str) {
   let result = "";

   for (let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);

      // Check if character is a letter
      if (charCode >= 65 && charCode <= 90) {
         // Uppercase letters
         result += String.fromCharCode(((charCode - 65 + 3) % 26) + 65);
      } else if (charCode >= 97 && charCode <= 122) {
         // Lowercase letters
         result += String.fromCharCode(((charCode - 97 + 3) % 26) + 97);
      } else {
         // Non-letters
         result += str[i];
      }
   }

   return result;
}

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

exports.sendMessage = catchAsync(async (req, res, next) => {
   const { chatId } = req.params;
   const { content } = req.body;
   const { type } = req.body;

   if (!chatId || !content) {
      return next(new AppError("Please provide chatId and the content"));
   }

   let result = encryption(content);

   console.log("res", result);

   let messageData = {
      sender: req.user._id,
      content: result,
      chat: chatId,
   };

   if (type) {
      messageData = {
         ...messageData,
         type,
      };
   }

   let message = await Message.create(messageData);
   message = await message.populate("sender", "name pic");
   message = await message.populate("chat");
   message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
   });

   if (!message) {
      return next(new AppError("Message not created"));
   }

   await Chat.findByIdAndUpdate(chatId, {
      lastestMessage: message._id,
   });

   console.log("message", message);

   message.content = decryption(message.content);

   res.status(201).json({
      success: true,
      message: message,
   });
});

exports.fetchAllChats = catchAsync(async (req, res, next) => {
   const { chatId } = req.params;

   const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

   let decryptedMess = [];

   for (let i = 0; i < messages.length; i++) {
      messages[i].content = decryption(messages[i].content);
      decryptedMess.push(messages[i]);
   }

   res.status(200).json({
      success: true,
      results: messages.length,
      messages: decryptedMess,
   });
});

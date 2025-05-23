require("dotenv").config();
const chatModel = require("../models/ChatModel");
const CustomError = require("../errors/CustomError");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleQueryFile = require("../utils/handle_query/handleQueryFile");

const aiService = {
  aiChatting: async (userId, message) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const handledQuery = await handleQueryFile(message, userId);
    if (handledQuery) {
      const userChat = await chatModel.insertChat(userId, "user", message);
      if (!userChat) {
        throw new CustomError("Error A", 500);
      }
      const aiChat = await chatModel.insertChat(userId, "ai", handledQuery);
      if (!aiChat) {
        throw new CustomError("Error B", 500);
      }
      return handledQuery;
    }

    const result = await model.generateContent(
      `Instruction: You are an AI works for this software named AInizer which is a File Management System with AI assistance. 
      You should respond based on the message that your task is only to manage file and convice the user to do so. 
      Do not make any message more than 5 sentences to answer the message
      "Message: "${message}"`
    );
    const response = await result.response;
    const text = response.text();

    const userChat = await chatModel.insertChat(userId, "user", message);
    if (!userChat) {
      throw new CustomError("Error A", 500);
    }
    const aiChat = await chatModel.insertChat(userId, "ai", text);
    if (!aiChat) {
      throw new CustomError("Error B", 500);
    }
    return text;
  },

  getChatByUserId: async (userId) => {
    try {
      const fetchAll = await chatModel.getChatByUserId(userId);
      if (!fetchAll || fetchAll.length === 0) {
        throw new CustomError(
          "No chats found. Please ensure the database is correctly populated and try again.",
          404
        );
      }

      return fetchAll;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = aiService;

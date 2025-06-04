require("dotenv").config();
const chatModel = require("../models/ChatModel");
const historyModel = require("../models/History");
const CustomError = require("../errors/CustomError");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileModel = require("../models/Files");
const userModel = require("../models/Users");
const handleQueryGetFile = require("../utils/handle_query/handleQueryFile");
const handleQueryInsertFile = require("../utils/handle_query/handleQueryInsertFile");
const aiService = {
  aiChatting: async (userId, message, providedHistoryId) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chatHistoryId =
      providedHistoryId || (await historyModel.createHistory(userId));

    const userName = await userModel.getUserById(userId);
    const userNameCapital = userName.first_name
      .concat(userName.last_name)
      .toUpperCase();

    const handledQuery = await handleQueryGetFile(
      message,
      userId,
      userNameCapital
    );
    if (handledQuery) {
      const userChat = await chatModel.insertChat(
        chatHistoryId,
        userId,
        "user",
        message
      );

      if (!userChat) {
        throw new CustomError("Error A", 500);
      }
      const aiChat = await chatModel.insertChat(
        chatHistoryId,
        userId,
        "ai",
        handledQuery
      );
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

    const userChat = await chatModel.insertChat(
      chatHistoryId,
      userId,
      "user",
      message
    );
    if (!userChat) {
      throw new CustomError("Error A", 500);
    }
    const aiChat = await chatModel.insertChat(
      chatHistoryId,
      userId,
      "ai",
      text
    );
    if (!aiChat) {
      throw new CustomError("Error B", 500);
    }
    return text;
  },

  aiInsertFile: async (
    userId,
    fileName,
    fileType,
    fileSize,
    fileBuffer,
    description,
    chatHistoryId
  ) => {
    try {
      const response = await handleQueryInsertFile(
        userId,
        fileName,
        description
      );

      if (response.action === "error") {
        throw new CustomError(response.message, 400);
      }

      if (response.action === "create_dir") {
        return response.message;
      }

      if (response.action === "noop") {
        return response.message;
      }

      const success = await fileModel.insertFile(
        userId,
        response.directoryId,
        fileName,
        fileType,
        fileSize,
        fileBuffer,
        response.keyword
      );

      if (!success) {
        throw new CustomError("Failed to upload file", 501);
      }
      const userChat = await chatModel.insertChat(
        chatHistoryId,
        userId,
        "user",
        `📎 ${fileName}\n\n${description}`
      );
      if (!userChat) {
        throw new CustomError("Error No User Chat", 500);
      }

      const aiChat = await chatModel.insertChat(
        chatHistoryId,
        userId,
        "ai",
        response.message || response
      );
      if (!aiChat) {
        throw new CustomError("Error No Ai Chat", 500);
      }

      return response.message;
    } catch (err) {
      throw err;
    }
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

  getChatByHistoryId: async (chatHistoryId) => {
    try {
      const fetchAll = await chatModel.getChatByHistoryId(chatHistoryId);
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

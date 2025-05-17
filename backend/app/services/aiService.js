require('dotenv').config();
const chatModel = require('../models/chatModel');
const CustomError = require('../errors/CustomError')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getChats } = require('../models/Chat');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiService = {
    aiChatting: async (message) => {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        const userChat = await chatModel.insertChat('user', message); 
         if(!userChat){
            throw new CustomError()
         }
        const aiChat = await chatModel.insertChat('ai', text)
        if(!aiChat){
            throw new CustomError()
         }
        return text;
    },
    getChats: async () => {
        try {
            const fetchAll = await chatModel.getChats();
            if (!fetchAll || fetchAll.length === 0) {
                throw new customError('No chats found. Please ensure the database is correctly populated and try again.', 404);
            }

            return fetchAll;
        } catch (err) {
            throw err;
        }
    },
    
};

module.exports = aiService;
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiService = {
    aiChatting: async (message) => {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        return text;
    },
};

module.exports = aiService;
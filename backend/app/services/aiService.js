require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleQueryFile = require("../utils/handle_query/handleQueryFile");

const aiService = {
  aiChatting: async (message) => {
    const handled = await handleQueryFile(message);
    if (handled) return handled;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return text;
  },
};

module.exports = aiService;

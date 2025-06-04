const directoryModel = require("../../models/Directory");
const fileModel = require("../../models/Files");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleQueryInsertFile = async (userId, fileName, description) => {
  const modelFlash = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  let checkDuplicate = await fileModel.getFileByNameUserID(fileName, userId);

  if (checkDuplicate) {
    const fallbackMessage = `File ${fileName} already exists!`;
    const localized = await generateLocalizedMessage(
      description,
      fallbackMessage
    );

    return {
      action: "noop",
      message: localized,
    };
  }

  const dirExtract = await model.generateContent(`
    Instruction: Extract the directory name the user want to put the file in refers to in this message. 
    Usually user won't specify if it's folder/directory but make sure if user wanted to put a file inside something, it must be the directory
    If none is found, return "default". 
    Double check with the language as well, usually it's in english or indonesia

    File Name : "${fileName}"
    Message: "${description}"
  `);
  const directoryName = dirExtract.response.text().trim() || "default";
  const targetDir = await directoryModel.getDirectoryByName(
    directoryName,
    userId
  );

  const keywordExtract = await model.generateContent(`
    Instruction: Extract the file name or keyword based on what the user 
    called the file is based on this message, 
    If the message do not give any command, just some names, use it as the keyword as well
    If none is found just put the file name
    Double check with the language as well, usually it's in english or indonesia

    Message: "${description}"
    FileName: "${fileName}"

    respond with just the keyword`);

  const keywordName = keywordExtract.response.text().trim() || "default";

  const serviceMessage = `${fileName} file is uploaded to ${directoryName} directory!`;

  const politeReply = await generateLocalizedMessage(
    description,
    serviceMessage
  );

  const target = targetDir
    ? targetDir[0]
    : await directoryModel.createDirectory(userId, directoryName, null);

  return {
    action: "upload",
    directoryId: target.id || target.insertId,
    message: politeReply,
    keyword: keywordName,
  };
};

async function generateLocalizedMessage(userMessage, serviceMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const prompt = `
    Instruction: You are an assistant for a file management system. 
    Based on the user's message and the system message below, rewrite the system message in a polite, friendly tone, 
    and in the same language as the user's message. Usually the common language is English and Indonesia
    Only said the revised message also not in quote.

    User Message: "${userMessage}"
    System Message: "${serviceMessage}"
  `;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

module.exports = handleQueryInsertFile;

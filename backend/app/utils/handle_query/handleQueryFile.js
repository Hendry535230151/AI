const fileModel = require("../../models/Files");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const port = process.env.PORT;

const fileCategories = {
  images: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
  compressed: ["zip", "rar", "7z", "tar", "gz"],
  documents: ["doc", "docx", "odt", "txt", "rtf"],
  pdf: ["pdf"],
  powerpoint: ["ppt", "pptx"],
  spreadsheets: ["xls", "xlsx", "csv"],
  videos: ["mp4", "mov", "avi", "mkv"],
  audio: ["mp3", "wav", "aac"],
};

const categorizeFile = (extension) => {
  for (const [category, extensions] of Object.entries(fileCategories)) {
    if (extensions.includes(extension.toLowerCase())) {
      return category;
    }
  }
  return "others";
};

const handleQueryFile = async (message, userId) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  try {
    const intentCheck = await model.generateContent(
      `Instruction: Classify the user's intent from the following message. 
      Possible intents: 
      - list: if user wants to list all files, or get their files 
      - searchByName: if user is looking for a file by name or related to it, 
      - none: if the intent is unrelated to files.

      Message: "${message}"
      Respond with only the intent label (list, searchByName, or none).`
    );
    const intent = (await intentCheck.response).text().trim().toLowerCase();

    const reply = await model.generateContent(
      `Instruction: Based on the following message, respond with a short, polite sentence indicating that you are providing the requested file(s). 
      Keep the tone natural, friendly, and in the same language as the user's message.
z
      Message: "${message}"`
    );
    const politeIntro = (await reply.response).text().trim();

    const typeExtract = await model.generateContent(
      `Instruction: Based on the user's message, identify if they are asking for a specific file type category (e.g., images, pdf, documents, compressed, audio, video, powerpoint, spreadsheets). 
      Return only the category name if detected, or "all" if they want all files.

      Message: "${message}"`
    );
    const requestedCategory = (await typeExtract.response)
      .text()
      .trim()
      .toLowerCase();

    switch (intent) {
      case "list": {
        let files = await fileModel.getFileByUserId(userId);
        if (!files || files.length === 0) {
          const notFoundReplyGen = await model.generateContent(
            `Instruction: The user requested files of type "${files}", but none were found. 
            Respond politely in the same language as their original message, 
            acknowledging the request and gently saying the files were not found.
        
            Message: "${message}"`
          );
          return (await notFoundReplyGen.response).text().trim();
        }

        if (requestedCategory !== "all") {
          files = files.filter((file) => {
            const ext = file.file_name.split(".").pop();
            return categorizeFile(ext) === requestedCategory;
          });

          if (files.length === 0) {
            const notFoundReplyGen = await model.generateContent(
              `Instruction: The user requested files of type "${requestedCategory}", but none were found. 
              Respond politely in the same language as their original message, 
              acknowledging the request and gently saying the files were not found.
          
              Message: "${message}"`
            );
            return (await notFoundReplyGen.response).text().trim();
          }
        }

        const fileList = files
          //.map((f) => `• ${f.file_name} (${f.file_type}, ${f.file_size} bytes)`)
          .map(
            (f) =>
              `• [${
                f.file_name
              }](http://localhost:${port}/download/${encodeURIComponent(
                f.file_name
              )})`
          )
          .join("\n");

        return `${politeIntro}\n\n${fileList}`;
      }

      case "searchbyname": {
        const extract = await model.generateContent(
          `Instruction: Extract the most likely file name the user is referring to from the message below. Return only the file name (1–2 words max).\nMessage: "${message}"`
        );
        const fileName = (await extract.response).text().trim();

        let results = await fileModel.getFileByNameDescriptionUserID(
          fileName,
          userId
        );
        if (!results || results.length === 0) {
          const notFoundReplyGen = await model.generateContent(
            `Instruction: The user requested files of type "${fileName}", but none were found. 
            Respond politely in the same language as their original message, 
            acknowledging the request and gently saying the files were not found.
        
            Message: "${message}"`
          );
          return (await notFoundReplyGen.response).text().trim();
        }

        if (requestedCategory !== "all") {
          results = results.filter((file) => {
            const ext = file.file_name.split(".").pop();
            return categorizeFile(ext) === requestedCategory;
          });

          if (results.length === 0) {
            return `No "${requestedCategory}" files found with name similar to "${fileName}".`;
          }
        }

        const fileList = results
          .map(
            (f) =>
              `• [${
                f.file_name
              }](http://localhost:${port}/download/${encodeURIComponent(
                f.file_name
              )})`
          )
          .join("\n");

        return `${politeIntro}\n\n${fileList}`;
      }

      case "none":
      default:
        return null;
    }
  } catch (error) {
    console.error("Error in handleFileQuery:", error);
    return "There was an error processing your file request.";
  }
};

module.exports = handleQueryFile;

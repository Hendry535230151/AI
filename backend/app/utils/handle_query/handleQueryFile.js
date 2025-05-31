const fileModel = require("../../models/Files");
const directoryModel = require("../../models/Directory");
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
      - list: if user wants to list all files, or get their files, or also get all file of a specific type but NOT from a specific directory
      - searchByName: if user is looking for a file by name or related to it by description, 
      - searchByDirectory: if user is looking to get all files from a specific directory
      - makeDir: if user wants to make a new directory or folder
      - moveFile: if user want to move an existing file to an existing folder/directory or new directory 
      - none: if the intent is unrelated to files.

      Message: "${message}"
      Respond with only the intent label (list, searchByName, or none).`
    );
    const intent = intentCheck.response.text().trim().toLowerCase();

    const reply = await model.generateContent(
      `Instruction: Based on the following message, respond with a short, polite sentence 
      indicating that you are providing the requested file(s).
      Keep the tone natural, friendly, and in the same language as the user's message.

      Message: "${message}"`
    );
    const politeIntro = reply.response.text().trim();

    const extract = await model.generateContent(
      `Instruction: Extract the most likely file name the user is referring to from the message below. Return only the file name (1–2 words max).\nMessage: "${message}"`
    );
    const fileName = extract.response.text().trim();

    const typeExtract = await model.generateContent(
      `Instruction: Based on the user's message, identify if they are asking for a specific file type category (e.g., images, pdf, documents, compressed, audio, video, powerpoint, spreadsheets). 
      Return only the category name if detected, or "all" if they want all files.

      Message: "${message}"`
    );
    const requestedCategory = typeExtract.response.text().trim().toLowerCase();

    const dirExtract = await model.generateContent(`
        Instruction: Extract the directory or folder name the user refers to in this message.
        If none is found, return "default".
      
        Message: "${message}"
      `);

    const directoryName = dirExtract.response.text().trim() || "default";
    const targetDir = await directoryModel.getDirectoryByName(
      directoryName,
      userId
    );
    console.log(intent);

    switch (intent) {
      case "list": {
        let files = await fileModel.getFilesByUserIdDirectory(userId);
        if (!files || files.length === 0) {
          const notFoundReplyGen = generateLocalizedMessage(
            message,
            "No Files found, please upload or insert a file first!"
          );
          return notFoundReplyGen.response;
        }

        if (requestedCategory !== "all") {
          files = files.filter((file) => {
            ext = file.file_name.split(".").pop();
            return categorizeFile(ext) === requestedCategory;
          });

          if (files.length === 0) {
            const notFoundReplyGen = generateLocalizedMessage(
              message,
              `No files found within ${requestedCategory}`
            );
            return notFoundReplyGen;
          }
        }

        const groupedFiles = groupFilesByDirectory(files);
        const fileList = generateFileListMarkdown(groupedFiles, port);

        return `${politeIntro}\n\n${fileList}`;
      }

      case "searchbyname": {
        let files = await fileModel.getFilesByNameAndIdDirectory(
          fileName,
          userId
        );
        if (!files || files.length === 0) {
          if (files.length === 0) {
            const notFoundReplyGen = generateLocalizedMessage(
              message,
              `No files found with the name or similar to ${fileName}`
            );
            return notFoundReplyGen;
          }
          if (requestedCategory !== "all") {
            files = files.filter((file) => {
              const ext = file.file_name.split(".").pop();
              return categorizeFile(ext) === requestedCategory;
            });
          }
        }
        const groupedFiles = groupFilesByDirectory(files);
        const fileList = generateFileListMarkdown(groupedFiles, port);

        return `${politeIntro}\n\n${fileList}`;
      }

      case "searchbydirectory": {
        if (!targetDir || targetDir.length === 0) {
          const notFoundReply = generateLocalizedMessage(
            message,
            `No ${targetDir} directory is found`
          );
          return notFoundReply;
        }

        const files = await fileModel.getFilesByUserIdAndIdDirectory(
          userId,
          targetDir?.[0].id
        );
        if (!files || files.length === 0) {
          const notFoundReply = generateLocalizedMessage(
            message,
            `No files found in directory "${targetDir}"`
          );
          return notFoundReply;
        }

        const groupedFiles = groupFilesByDirectory(files);
        const fileList = generateFileListMarkdown(groupedFiles, port);

        return `${politeIntro}\n\n${fileList}`;
      }
      case "makedir": {
        const checkDup = await directoryModel.checkDuplicateDirectory(
          userId,
          directoryName
        );

        if (checkDup) {
          const notFoundReplyGen = generateLocalizedMessage(
            message,
            `${targetDir} Directory already exists`
          );
          return notFoundReplyGen;
        }

        const result = await directoryModel.createDirectory(
          userId,
          directoryName,
          null
        );
        return generateLocalizedMessage(message, result);
      }

      case "movefile": {
        const moveExtract = await model.generateContent(`
          Instruction: From the following message, extract the name of the file to move and the target directory. 
          Respond with only: <file_name> | <target_directory>. If unsure, guess as best as possible.
      
          Message: "${message}"
        `);

        const [fileName, targetDirName] = moveExtract.response
          .text()
          .trim()
          .split("|")
          .map((p) => p.trim());

        const file = (
          await fileModel.getFileByNameUserID(fileName, userId)
        )?.[0];
        const dir = (
          await directoryModel.getDirectoryByName(targetDirName, userId)
        )?.[0];

        if (!file) {
          return await generateLocalizedMessage(
            message,
            `File "${fileName}" not found.`
          );
        }

        if (!dir) {
          return await generateLocalizedMessage(
            message,
            `Directory "${targetDirName}" not found.`
          );
        }

        const result = await fileModel.moveFileToDirectory(file.id, dir.id);
        return await generateLocalizedMessage(message, result);
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

async function generateLocalizedMessage(userMessage, serviceMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const prompt = `
    Instruction: You are an assistant for a file management system. 
    Based on the user's message and the system message below, rewrite the system message in a polite, friendly tone, 
    and in the same language as the user's message. Only said the revised message also not in quote.

    User Message: "${userMessage}"
    System Message: "${serviceMessage}"
  `;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

function groupFilesByDirectory(files) {
  const fileGroups = {};

  for (const file of files) {
    const dirName = file.directory_name;
    const key = file.directory_id;
    if (!fileGroups[key])
      fileGroups[key] = {
        dirName,
        files: [],
      };
    fileGroups[key].files.push(file);
  }

  return Object.values(fileGroups);
}

function generateFileListMarkdown(grouped, port) {
  let fileList = "";

  for (const group of grouped) {
    fileList += `\n${group.dirName}:\n`;
    group.files.forEach((file, idx) => {
      fileList += `\t\t${idx + 1}. [${
        file.file_name
      }](http://localhost:${port}/download/${encodeURIComponent(
        file.file_name
      )}) - ${file.description || ""}\n`;
    });
  }

  return fileList;
}

module.exports = handleQueryFile;

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

const handleQueryFile = async (message, userId, userName) => {
  const modelFlash = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  try {
    const intentCheck = await modelFlash.generateContent(
      `Instruction: Classify the user's intent from the following message. 
      Possible intents: 
      - list: if user wants to list all files, or get their files, or also get all file of a specific type but NOT from a specific directory
      - searchByName: if user is looking for a file by name or related to it by description, 
      - searchByDirectory: if user is looking to get all files from a specific directory
      - makeDir: if user wants to make a new directory or folder
      - moveFile: if user want to move an existing file to an existing folder/directory or new directory
      - deleteFile: if user want to delete a file
      - confirmDeleteFile: if user's message is UserName/File as confirmation to delete file. but the username from message must be the exact same as "${userName}" from server
      - none: if the intent is unrelated to files.
      Double check with the language as well, usually it's in english or indonesia

      Message: "${message}"
      Respond with only the intent label (list, searchByName, or none).`
    );
    let intent = intentCheck.response.text().trim().toLowerCase();

    if (intent === "confirmdeletefile" && message.split("/")[0] !== userName) {
      intent = "wrongconfirmation";
    }

    const reply = await model.generateContent(
      `Instruction: Based on the following message, respond with a short, polite sentence 
      indicating that you are providing the requested file(s).
      Keep the tone natural, friendly, and in the same language as the user's message.

      Message: "${message}"`
    );
    const politeIntro = reply.response.text().trim();

    const extract = await model.generateContent(
      `Instruction: Extract the most likely file name the user is referring to from the message below. Return only the file name (1–2 words max).\nMessage: "${message}"
      Double check with the language as well, usually it's in english or indonesia`
    );
    const fileName = extract.response.text().trim();

    const typeExtract = await model.generateContent(
      `Instruction: Based on the user's message, identify if they are asking for a specific file type category (e.g., images, pdf, documents, compressed, audio, video, powerpoint, spreadsheets). 
      Return only the category name if detected, or "all" if they want all files.
      Double check with the language as well, usually it's in english or indonesia

      Message: "${message}"`
    );
    const requestedCategory = typeExtract.response.text().trim().toLowerCase();

    const dirExtract = await model.generateContent(`
        Instruction: Extract the name of directory or folder name the user refers to in this message.
        If none is found, return "default".
        Double check with the language as well, usually it's in english or indonesia
      
        Message: "${message}"
      `);

    let directoryNameTemp = dirExtract.response.text().trim() || "default";
    const directoryName = directoryNameTemp.replace("", "");

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

      case "deletefile": {
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
        }

        const groupedFiles = groupFilesByDirectory(files);
        const fileList = generateFileListMarkdown(groupedFiles, port);

        const deleteReply = await model.generateContent(
          `Instruction: From the following message, you'll be asked to delete certain file from the user
          As a confirmation to delete the file, you need to give them the confirmation method telling them to type
          "UserName/FileName"
          UserName: "${userName}"
          FileName: "${fileList}", get the name of the fileName inside the bracket []
          FileDirectory: "${fileList}", get the name of the directory from string with : at the end
          Format the returning file: 
          "FileDirectory: FileName (description)"
          if the file is more than one, type the confirmation word ask the user to choose the filename by themselves 
          You must respond with the output only (don't put FileDirectory: and Confirmation:)
          `
        );

        const reply = deleteReply.response.text().trim();
        const replyLocalized = await generateLocalizedMessage(message, reply);

        return `${replyLocalized}`;
      }

      case "confirmdeletefile": {
        const file = await fileModel.getFileByNameUserID(fileName, userId);
        if (file === false) {
          return await generateLocalizedMessage(
            message,
            `File "${fileName}" not found.`
          );
        }

        const deletion = await fileModel.deleteFileById(file?.[0].id);

        if (deletion === false) {
          return await generateLocalizedMessage(
            message,
            `The deletion of "${fileName}" failed`
          );
        }

        return await generateLocalizedMessage(
          message,
          `The deletion of "${fileName}" succeed`
        );
      }

      case "wrongconfirmation": {
        const reply =
          "Wrong confirmation to delete the file, please double check again";
        const replyLocalized = await generateLocalizedMessage(message, reply);
        return `${replyLocalized}`;
      }

      case "none":
      default:
        return null;
    }
  } catch (error) {
    console.error("Error in handleFileQuery:", error);
    return "Server is busy, please try again in a few minutes";
  }
};

async function generateLocalizedMessage(userMessage, serviceMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const prompt = `
    Instruction: You are an assistant for a file management system. 
    Based on the user's message and the system message below, rewrite the system message in a polite, friendly tone, 
    and in the same language as the user's message. Usually the common language is English or Indonesia
    Only said the revised message also not in quote.

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

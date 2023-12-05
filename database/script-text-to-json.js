const fs = require("fs").promises;
const path = require("path");

const getWordCount = (str) => {
  const array = str?.trim().split(/\s+/);
  return array?.length;
};
const parseDialogue = (text, item) => {
  const lines = text.split("\n");
  const dialogues = lines.map((line, index) => {
    const [character, dialogue] = line.split("=>");
    const wordCount = getWordCount(dialogue);

    const gender =
      item.actorList.find((d) => {
        const characterNameOnScript = character.toLowerCase();
        const characterNameOnDB = d.asCharacter.toLowerCase();
        const match = characterNameOnDB.includes(characterNameOnScript);
        characterNameOnDB === "officer parker" &&
          console.log(
            characterNameOnDB,
            "**",
            character,
            characterNameOnScript,
            match
          );
        return match;
      })?.gender || "NA";

    return {
      id: index,
      index,
      character,
      gender,
      line: dialogue?.trim(),
      wordCount,
    };
  });
  return dialogues;
};

// 하나의 통 json
async function createJsonFromTextFiles(directory) {
  try {
    const top250raw = await fs.readFile("movies_data.json", "utf8");
    // 데이터를 JavaScript 객체로 변환
    const top250 = JSON.parse(top250raw);

    const files = await fs.readdir(directory);
    const json = [];

    for (const file of files) {
      if (path.extname(file) === ".txt") {
        const data = await fs.readFile(path.join(directory, file), "utf8");
        const title = file.replace("_dialogue.txt", "").split("-").join(" ");
        const item = top250.find((d) => d.title === title);
        if (item) {
          json.push({ fileName: file, title, data: parseDialogue(data, item) });
        }
      }
    }

    await fs.writeFile("output.json", JSON.stringify(json, null, 2));
    console.log("JSON file has been created.");
  } catch (error) {
    console.error("Error:", error);
  }
}

// 한 파일씩
async function createJsonFilesFromText(directory) {
  try {
    const top250raw = await fs.readFile("movies_data.json", "utf8");
    // 데이터를 JavaScript 객체로 변환
    const top250 = JSON.parse(top250raw);
    const files = await fs.readdir(directory);

    for (const file of files) {
      if (path.extname(file) === ".txt") {
        const data = await fs.readFile(path.join(directory, file), "utf8");
        const jsonFileName = path.join(
          "outputs",
          path.basename(file, ".txt") + ".json"
        );

        const title = file.replace("_dialogue.txt", "").split("-").join(" ");
        const item = top250.find((d) => d.title === title);
        if (item) {
          const jsonData = JSON.stringify(
            {
              fileName: file,
              title,
              data: parseDialogue(data, item),
            },
            null,
            2
          );

          await fs.writeFile(jsonFileName, jsonData);
          console.log(`${jsonFileName} has been created.`);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Replace 'your_directory_path' with the path to your directory containing text files
// createJsonFromTextFiles("script-analysis/scripts/parsed/dialogue");

// createJsonFilesFromText("script-analysis/scripts/parsed/dialogue");

async function saveTextFileNamesAsJsArray(directory) {
  try {
    const files = await fs.readdir(directory);
    const textFileNames = files.filter((file) => path.extname(file) === ".txt");

    const jsContent = `const fileNames = ${JSON.stringify(
      textFileNames,
      null,
      2
    )};\nmodule.exports = fileNames;`;

    await fs.writeFile(path.join("fileNames.js"), jsContent);
    console.log(
      "fileNames.js has been created with the array of text file names."
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

// Replace 'your_directory_path' with the path to your directory containing text files
saveTextFileNamesAsJsArray("script-analysis/scripts/parsed/dialogue");

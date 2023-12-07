const fs = require("fs");
const csv = require("csv-parser");

const csvFilePath =
  "movies_sentiment_analysis_with_gender_and_imdbCharacter_final.csv"; // CSV 파일 경로
const jsonFilePath = "outputfile.json";

let movies = {};

async function run() {
  const top250raw = await fs.promises.readFile("movies_data.json", "utf8");
  const top250 = JSON.parse(top250raw);

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      const movieTitle = row.Movie;
      if (!movies[movieTitle]) {
        movies[movieTitle] = {
          title: movieTitle,
          lines: [],
          totalWordCount: 0,
        };
      }
      const lineWordCount = getWordCount(row.Dialogue);

      movies[movieTitle].lines.push({
        index: movies[movieTitle].lines.length,
        character: row.Character,
        imdbCharacter: row.imdbCharacter,
        line: row.Dialogue,
        emotion: row.Emotion,
        emotionScore: row.Score,
        gender: row.Gender,
        wordCount: lineWordCount,
        wordCountCursor: movies[movieTitle].totalWordCount,
      });
      movies[movieTitle].totalWordCount =
        movies[movieTitle].totalWordCount + lineWordCount;
    })
    .on("end", () => {
      // JSON 파일로 내보내기
      let output = Object.values(movies);
      const invalid = ["Aladdin", "Alien", "Trainspotting"];

      const processed = output
        .filter((d) => !invalid.includes(d.title))
        .map((d) => {
          if (d.title === "Schindlers List") d.title = "Schindler's List";
          if (d.title === "LA Confidential") d.title = "L.A. Confidential";
          if (d.title === "One Flew Over the Cuckoos Nest")
            d.title = "One Flew Over the Cuckoo's Nest";
          if (d.title === "Its a Wonderful Life")
            d.title = "It's a Wonderful Life";
          if (d.title === "Lock Stock and Two Smoking Barrels")
            d.title = "Lock, Stock and Two Smoking Barrels";
          if (d.title === "Sunset Blvd") d.title = "Sunset Blvd.";

          const item = top250.find((item) => item.title === d.title);
          if (!item) console.log(d.title, "no matching w title");

          const totalWordCount = arraySum(d.lines.map((l) => l.wordCount));
          const genderWordCount = {
            female: arraySum(
              d.lines.map((l) => (l.gender === "Female" ? l.wordCount : 0))
            ),
            male: arraySum(
              d.lines.map((l) => (l.gender === "Male" ? l.wordCount : 0))
            ),
            na: arraySum(
              d.lines.map((l) => (l.gender === "NA" ? l.wordCount : 0))
            ),
          };
          const genderWordPercent = {
            female: genderWordCount.female / totalWordCount,
            male: genderWordCount.male / totalWordCount,
            na: genderWordCount.na / totalWordCount,
          };

          return {
            id: item.id,
            title: item.title,
            data: item,
            totalWordCount,
            genderWordCount,
            genderWordPercent,
            ...d,
          };
        });

      fs.writeFile(jsonFilePath, JSON.stringify(processed, null, 2), (err) => {
        if (err) {
          console.error("An error occurred:", err);
          return;
        }
        console.log("JSON file has been saved.");
      });
    });
}

// run();

getFilteredJson();

const getWordCount = (str) => {
  const array = str?.trim().split(/\s+/);
  return array?.length;
};
const arraySum = (arr) => arr.reduce((sum, x) => sum + x);

async function getFilteredJson() {
  const outFilePath = "filteredJson.json";

  const dialogueRaw = await fs.promises.readFile(jsonFilePath, "utf8");
  const dialogue = JSON.parse(dialogueRaw);

  const sample = ["Jaws", "Jurassic Park"];
  const dialogueSampleDataset = dialogue.filter((d) =>
    sample.includes(d.title)
  );

  fs.writeFile(
    outFilePath,
    JSON.stringify(dialogueSampleDataset, null, 2),
    (err) => {
      if (err) {
        console.error("An error occurred:", err);
        return;
      }
      console.log("JSON file has been saved.");
    }
  );
}

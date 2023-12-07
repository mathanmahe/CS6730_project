const fs = require("fs");

async function run() {
  const top250raw = await fs.promises.readFile("movies_data.json", "utf8");
  const postersraw = await fs.promises.readFile("movies_data_f.json", "utf8");

  const top250 = JSON.parse(top250raw);
  const posters = JSON.parse(postersraw);
  console.log(posters.length, "asdfasdfsd");

  const outFilePath = "movie_data_poster.json";

  const processed = top250.map((d) => {
    const { posterFProportion, posterMProportion } =
      posters.find((p) => p.id === d.id) || {};
    let decade;
    let decadeNum;
    const year = parseInt(new Date(d.releaseDate).getFullYear());
    if (year < 1950) {
      decade = "Before the 1950s";
      decadeNum = 1940;
    } else {
      decadeNum = Math.floor(year / 10) * 10;
      decade = `${decadeNum}s`;
    }

    return {
      posterFProportion,
      posterMProportion,
      decade,
      decadeNum,
      worldGross: parseInt(
        d.boxOffice.cumulativeWorldwideGross.replace("$", "").replace(/,/g, "")
      ),
      budget: parseInt(d.boxOffice.budget.match(/\d+/g)?.join("")),
      ...d,
    };
  });

  fs.writeFile(outFilePath, JSON.stringify(processed, null, 2), (err) => {
    if (err) {
      console.error("An error occurred:", err);
      return;
    }
    console.log("JSON file has been saved.");
  });
}

run();

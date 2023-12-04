import rawData from "../assets/movies_data.json";

const process = (data) => {
  return data.map((d) => {
    let decade;
    let decadeNum;
    const year = parseInt(d.year);
    if (year < 1960) {
      decade = "Before the 1960s";
      decadeNum = 1950;
    } else {
      decadeNum = Math.floor(year / 10) * 10;
      decade = `${decadeNum}s`;
    }
    return {
      ...d,
      decade,
      decadeNum,
      worldGross: parseInt(
        d.boxOffice.cumulativeWorldwideGross.replace("$", "").replace(/,/g, "")
      ),
    };
  });
};
export const data = process(rawData);
export const allGenreData = data
  .map((d) =>
    d.genreList.map((genre) => ({
      ...d,
      genre: genre.value,
      key: d.id + genre.value,
    }))
  )
  .flat();
export const bechdelDomain = [0, 1, 2, 3];
export const decadesDomain = [
  "Before the 1960s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];
export const genreDomain = Array.from(
  new Set(data.map((d) => d.genreList.map((d) => d.value)).flat())
);
export const filteredGenreDomain = [
  "Drama",
  "Crime",
  "Action",
  "Adventure",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  // "Family",
  "Thriller",
  "Comedy",
].reverse();

export const filteredGenreData = allGenreData.filter((d) =>
  filteredGenreDomain.includes(d.genre)
);

export const directorsDomain = ["Female", "Male"];

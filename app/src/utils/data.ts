import data from "../assets/movies_data.json";
import * as d3 from "d3";

export const colorGenderMap = {
  female: "#E35E6D",
  male: "#0087A7",
  na: "#5D666F",
};
export const colorBechelMap = {
  NA: "#5D666F",
  0: "#0087A7",
  1: "#3DBCD3",
  2: "#98D8DD",
  3: "#E35E6D",
};

// budget has diffeent currency - invalid
export const budgetExtent = d3.extent(data.map((d) => Number(d["budget"])));
export const grossExtent = d3.extent(data.map((d) => Number(d["worldGross"])));
export const voteExtent = d3.extent(
  data.map((d) => Number(d["imDbRatingVotes"]))
);

export const sizeExtentMap = {
  budget: budgetExtent,
  worldGross: grossExtent,
  imDbRatingVotes: voteExtent,
};

export const allGenreData = data
  .map((d) =>
    d.genreList.map((genre) => ({
      ...d,
      genre: genre.value,
      key: d.id + genre.value,
    }))
  )
  .flat();
export const bechdelDomain = ["NA", 0, 1, 2, 3];

export const decadesDomain = [
  "Before the 1950s",
  "1950s",
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

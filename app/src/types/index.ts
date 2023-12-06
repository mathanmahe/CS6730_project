//100 movies
export type Script = {
  id: string;
  rank: string | number; // imdb rank
  title: string;
  // fullTitle: string;
  year: string | number;
  image: string; // poster url
  imDbRating: string | number;
  imDbRatingCount: string | number;

  actorsList: {
    // "id": "nm0000122",
    // "image": "https://m.media-amazon.com/images/M/MV5BNDcwMDc0ODAzOF5BMl5BanBnXkFtZTgwNTY2OTI1MDE@._V1_Ratio1.0000_AL_.jpg",
    // "name": "Charles Chaplin",
    // "asCharacter": "A Tramp"
    gender: "female" | "male";
  }[];
  bechdelScore: string | number;
};

// for every actorlist query name api and see role (actor, actress)
// character -> (cast)-> gender

export type Dialogue = {
  id: string | number;
  index: number;
  character: string;
  gender: "F" | "M";
  line: string;
  wordCount: number;
};

export type DialogueDataset = {
  title: string;
  data: Dialogue[];
}[];
export type ChunkedDialogue = {
  chunkIndex: number;
  data: Dialogue[];
  femalePercentage: number;
};
export type ChunkedDialogueDataset = {
  title: string;
  data: ChunkedDialogue[];
}[];

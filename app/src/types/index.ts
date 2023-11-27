export type Script = {
  id: string | number;
  title: string;
  bechdel: string | number;
  year: string | number;
};
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

import { Dialogue } from "../types";

export const parseDialogue = (text: string): Dialogue[] => {
  const lines = text.split("\n");
  const dialogues = lines.map((line, index) => {
    const [character, dialogue] = line.split("=>");
    const wordCount = getWordCount(dialogue);
    return {
      id: index,
      index,
      character,
      gender: (Math.random() > 0.7 ? "F" : "M") as "F" | "M",
      line: dialogue?.trim(),
      wordCount,
    };
  });
  return dialogues;
};

export const getWordCount = (str: string) => {
  const array = str?.trim().split(/\s+/);
  return array?.length;
};

export const splitArray = (arr: any[], size: number) => {
  const result = [];
  const partSize = Math.floor(arr.length / size);
  for (let i = 0; i < size; i++) {
    if (i === size - 1) {
      result.push(arr.slice(i * partSize));
    } else {
      result.push(arr.slice(i * partSize, (i + 1) * partSize));
    }
  }
  return result;
};

export const getFemalePercentage = (data: Dialogue[]) => {
  const totalCount = data.length;
  const femaleCount = data.filter((item) => item.gender === "F").length;

  return femaleCount / totalCount;
};

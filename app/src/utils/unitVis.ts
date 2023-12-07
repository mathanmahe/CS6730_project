import * as d3 from "d3";
import dialogueSampleData from "../assets/dialogue-sample.json";

const sampleTitles = dialogueSampleData.map((d) => d.title);

export const prepareUnits = ({
  svg,
  data,
  containerDiv,
  bechdelColorScale,
}) => {
  const marksGroup = svg.select("g.marks");
  const marks = marksGroup
    .selectAll("rect.mark")
    .data(data)
    .join("rect")
    .attr("class", (d, i) => {
      if (sampleTitles[0] === d.title && d.genre === "Adventure")
        return "mark compare movie1";
      else if (sampleTitles[1] === d.title && d.genre === "Adventure")
        return "mark compare movie2";
      else return "mark";
    })
    .attr("opacity", 0);

  const resetMarks = (duration: number = 600, show: boolean) => {
    marks.attr("opacity", show ? 1 : 0).attr("pointer-events", "none");
    const posters = containerDiv.selectAll("div.unit-poster");
    posters.style("opacity", 0);
  };

  // const defs = svg.select("defs");
  // defs
  //   .selectAll("pattern")
  //   .data(data)
  //   .join("pattern")
  //   .attr("id", (d) => d.id)
  //   .selectAll("image")
  //   .data((d) => [d])
  //   .join("image")
  //   // .attr("xlink:href", (d) => d.image);

  return {
    marksGroup,
    marks,
    resetMarks,
  };
};

export const prepareGenreUnits = ({ svg, data, bechdelColorScale }) => {
  const genreMarksGroup = svg.select("g.genre-marks");
  const genreMarks = genreMarksGroup
    .selectAll("rect.genre-mark")
    .data(data)
    .join("rect")
    .attr("class", (d, i) => {
      //TODO use movie id
      if (sampleTitles[0] === d.title && d.genre === "Adventure")
        return "genre-mark compare movie1";
      else if (sampleTitles[1] === d.title && d.genre === "Adventure")
        return "genre-mark compare movie2";
      else return "genre-mark";
    })
    .attr("fill", (d) => bechdelColorScale(d.BechdelRating) as string)
    .attr("opacity", 0);

  const resetGenreMarks = (duration: number = 600, show: boolean) => {
    genreMarks
      // .transition()
      // .duration(duration)
      .attr("opacity", show ? 1 : 0)
      .attr("pointer-events", "none");
  };
  return {
    genreMarksGroup,
    genreMarks,
    resetGenreMarks,
  };
};

import { beeswarmForce } from "./beeswarmForce";
import * as d3 from "d3";

export const prepareUnits = ({ svg, data, bechdelColorScale }) => {
  const marksGroup = svg.select("g.marks");
  const marks = marksGroup
    .selectAll("rect.mark")
    .data(data)
    .join("rect")
    .attr("class", (d, i) => {
      //TODO use movie id
      if (i === 0) return "mark compare movie1";
      else if (i === 1) return "mark compare movie2";
      else return "mark";
    })
    .attr("fill", (d) => bechdelColorScale(d.BechdelRating) as string)
    .attr("opacity", 0);

  const resetMarks = (duration: number = 600, show: boolean) => {
    marks
      .transition()
      .duration(duration)
      .attr("opacity", show ? 1 : 0);
  };
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
      if (i === 0) return "genre-mark compare movie1";
      else if (i === 1) return "genre-mark compare movie2";
      else return "genre-mark";
    })
    .attr("fill", (d) => bechdelColorScale(d.BechdelRating) as string)
    .attr("opacity", 0);

  const resetGenreMarks = (duration: number = 600, show: boolean) => {
    genreMarks
      .transition()
      .duration(duration)
      .attr("opacity", show ? 1 : 0);
  };
  return {
    genreMarksGroup,
    genreMarks,
    resetGenreMarks,
  };
};

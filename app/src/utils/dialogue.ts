import * as d3 from "d3";
export const prepareDialoguePlot = ({ svg, data }) => {
  // 2 movies comparison bins
  const dialogueContainer = d3.select(".dialogue-container");
  const dialoguePlotGroup = svg.select("g.dialogue-plots-group");

  dialoguePlotGroup
    .selectAll("g.dialogue-plot")
    .data(data)
    .join("g")
    .attr("class", (d, i) => `dialogue-plot movie-${i}`)
    .selectAll("rect.bin")
    .data((d) => d.data)
    .join("rect")
    .attr("class", "bin");

  const resetDialoguePlot = (duration: number = 600, onlyPlot = false) => {
    if (!onlyPlot) {
      dialogueContainer
        // .transition().duration(duration)
        .style("opacity", 0);
    }
    dialoguePlotGroup
      .selectAll("rect")
      // .transition()
      // .duration(duration)
      .attr("width", 0)
      .attr("height", 0.5)
      .attr("stroke", "none");
  };

  return {
    dialogueContainer,
    dialoguePlotGroup,
    resetDialoguePlot,
  };
};

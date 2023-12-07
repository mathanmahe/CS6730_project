export const prepareDialoguePlot = ({ svg, data, containerDiv }) => {
  // 2 movies comparison bins
  const dialogueContainer = containerDiv.select(".dialogue-container");
  const dialoguePlotGroup = svg.select("g.dialogue-plots-group");
  const samplePosterGroup = containerDiv.select("div.sample-posters");

  const plot = dialoguePlotGroup
    .selectAll("g.dialogue-plot")
    .data(data)
    .join("g")
    .attr("class", (d, i) => `dialogue-plot movie-${i}`);

  plot
    .selectAll("rect.bin")
    .data((d) => d.data)
    .join("rect")
    .attr("class", "bin");

  plot
    .selectAll("text.label")
    .data((d) => [d])
    .join("text")
    .attr("class", "label")
    .text((d) => d.title)
    .attr("opacity", 0);

  const resetDialoguePlot = (option?) => {
    const { onlyPlot = false, onlyDiv = false } = option || {};

    if (!onlyPlot) {
      dialogueContainer.interrupt();
      samplePosterGroup.interrupt();
      dialogueContainer.style("opacity", 0);
      samplePosterGroup.style("opacity", 0);
    }
    if (!onlyDiv) {
      dialoguePlotGroup.interrupt().selectAll("*").interrupt();
      dialoguePlotGroup
        .selectAll("rect")
        // .transition()
        // .duration(duration)
        .attr("width", 0)
        .attr("height", 0.5)
        .attr("stroke", "none");
      dialoguePlotGroup.selectAll("text").attr("opacity", 0);
    }
  };

  return {
    dialogueContainer,
    dialoguePlotGroup,
    resetDialoguePlot,
  };
};

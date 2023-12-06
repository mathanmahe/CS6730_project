import * as d3 from "d3";

export const prepareStackedArea = ({
  svg,
  data,
  decadesDomain,
  bechdelDomain,
  xDecade,
  yCount,
  bechdelColorScale,
}) => {
  // Stacked chart
  const decadeGroup = d3.group(data, (d) => d.decade);
  const decadeGroupSorted = Array.from(d3.group(data, (d) => d.decade)).sort(
    (a, b) => {
      return decadesDomain.findIndex((d) => d === a[0]) >
        decadesDomain.findIndex((d) => d === b[0])
        ? 1
        : -1;
    }
  );

  const bechdelCountStackData = d3
    .stack()
    .keys(bechdelDomain)
    .value((d, key) => {
      const total = d[1].length;
      const bechdelLen = d[1].filter(
        (item) => item.BechdelRating === key
      ).length;
      return (bechdelLen / total) * 100;
    })(decadeGroupSorted);

  const areaTransitionStart = d3
    .area()
    // .x((d) => xDecade(decadesDomain[0]) + xDecade.bandwidth() / 2)
    .x((d) => xDecade(d.data[0]) + xDecade.bandwidth() / 2)
    .y0((d, i) => yCount(0))
    .y1((d, i) => yCount(0))
    .curve(d3.curveBasis);

  const areaTransitionEnd = d3
    .area()
    .x((d) => xDecade(d.data[0]) + xDecade.bandwidth() / 2)
    .y0((d) => yCount(d[0]))
    .y1((d) => yCount(d[1]))
    .curve(d3.curveBasis);

  const areasGroup = svg.select("g.stacks");
  const stacked = areasGroup
    .selectAll("path.area")
    .data(bechdelCountStackData)
    .join("path")
    .attr("class", "area")
    .attr("fill", (d, i) => bechdelColorScale(d.key) as string)
    .attr("opacity", 0)
    .attr("d", areaTransitionStart);

  const resetStackedArea = (duration: number = 0) => {
    stacked.transition().duration(duration).attr("opacity", 0);
  };

  return {
    decadeGroup,
    areaTransitionStart,
    areasGroup,
    areaTransitionEnd,
    stacked,
    resetStackedArea,
  };
};

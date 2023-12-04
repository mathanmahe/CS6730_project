import * as d3 from "d3";

export const getAxis = ({
  svg,
  data,
  height,
  width,
  decadesDomain,
  bechdelDomain,
  genreDomain,
  directorsDomain,
}) => {
  // Axis
  // Scatter plot axis
  const plotHeight = height - 100;
  const leftMargin = width * 0.35;

  const scatterYRange = [
    height / 2 + plotHeight / 2,
    height / 2 - plotHeight / 2,
  ];

  // x axis - year
  const xYear = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.decadeNum)))
    .range([leftMargin, width]);

  const xYearAxis = d3.axisBottom(xYear);
  const xYearAxisGroup = svg
    .select("g.x-axis-year")
    .style("transform", `translateY(${scatterYRange[0]}px)`)
    .call(xYearAxis);

  xYearAxisGroup.attr("opacity", 0);

  // x axis - decade
  const xDecade = d3
    .scaleBand()
    .domain(decadesDomain)
    .range([leftMargin, width])
    .padding(0.5);
  const xDecadeAxis = d3.axisBottom(xDecade);
  const xDecadeAxisGroup = svg
    .select("g.x-axis-decade")
    .style("transform", `translateY(${scatterYRange[0]}px)`)
    .call(xDecadeAxis);

  xDecadeAxisGroup.attr("opacity", 0);

  // x axis - decade
  const xDirector = d3
    .scaleBand()
    .domain(directorsDomain)
    .range([leftMargin, width])
    .padding(0.5);
  const xDirectorAxis = d3.axisBottom(xDirector);
  const xDirectorAxisGroup = svg
    .select("g.x-axis-director")
    .style("transform", `translateY(${scatterYRange[0]}px)`)
    .call(xDirectorAxis);

  xDirectorAxisGroup.attr("opacity", 0);

  // y axis = bechdel
  const yBechdel = d3.scaleBand().domain(bechdelDomain).range(scatterYRange);

  const yBechdelAxis = d3.axisLeft(yBechdel).tickFormat((d) => `${d}`);
  const yBechdelAxisGroup = svg
    .select("g.y-axis-bechdel")
    .style("transform", `translateX(${leftMargin}px)`)
    .call(yBechdelAxis);
  yBechdelAxisGroup.attr("opacity", 0);

  // y axis count
  const yCount = d3.scaleLinear().domain([0, 50]).range(scatterYRange);
  const yCountAxis = d3.axisLeft(yCount).tickFormat((d) => `${d}`);
  const yCountAxisGroup = svg
    .select("g.y-axis-count")
    .style(
      "transform",
      `translateX(${leftMargin + xDecade.bandwidth() * 1.5 - 5}px)`
    )
    .call(yCountAxis);

  yCountAxisGroup.attr("opacity", 0);

  // y axis = genre
  // const genrePlotHeight = height - 30;
  // const genreYRange = [
  //   height / 2 + genrePlotHeight / 2,
  //   height / 2 - genrePlotHeight / 2,
  // ];

  const yGenre = d3.scaleBand().domain(genreDomain).range(scatterYRange);
  const yGenreAxis = d3.axisLeft(yGenre).tickFormat((d) => `${d}`);
  const yGenreAxisGroup = svg
    .select("g.y-axis-genre")
    .style("transform", `translateX(${leftMargin}px)`)
    .call(yGenreAxis);
  yGenreAxisGroup.attr("opacity", 0);

  const resetAxis = (
    duration: number = 600,
    option?: {
      yBechdel?: boolean;
      yGenre?: boolean;
      xYear?: boolean;
      yCount?: boolean;
      xDecade?: boolean;
      xDirector?: boolean;
    }
  ) => {
    const opt = {
      yBechdel: true,
      yGenre: true,
      xYear: true,
      yCount: true,
      xDecade: true,
      xDirector: true,
      ...option,
    };
    opt.yBechdel &&
      yBechdelAxisGroup.transition().duration(duration).attr("opacity", 0);
    opt.yGenre &&
      yGenreAxisGroup.transition().duration(duration).attr("opacity", 0);
    opt.yCount &&
      yCountAxisGroup.transition().duration(duration).attr("opacity", 0);
    opt.xYear &&
      xYearAxisGroup.transition().duration(duration).attr("opacity", 0);
    opt.xDecade &&
      xDecadeAxisGroup.transition().duration(duration).attr("opacity", 0);
    opt.xDirector &&
      xDirectorAxisGroup.transition().duration(duration).attr("opacity", 0);
  };

  return {
    resetAxis,
    plotHeight,
    leftMargin,
    scatterYRange,
    // genreYRange,
    xYear,
    xYearAxis,
    xYearAxisGroup,
    xDecade,
    xDecadeAxis,
    xDecadeAxisGroup,
    yBechdel,
    yBechdelAxis,
    yBechdelAxisGroup,
    yCount,
    yCountAxis,
    yCountAxisGroup,
    yGenre,
    yGenreAxis,
    yGenreAxisGroup,
    xDirector,
    xDirectorAxis,
    xDirectorAxisGroup,
  };
};

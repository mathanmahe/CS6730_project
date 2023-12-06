import * as d3 from "d3";

export const getAxis = ({
  plotHeight,
  leftMargin,
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
  const offset = plotHeight * 0.05;
  const scatterYRange = [
    height / 2 + plotHeight / 2 - offset,
    height / 2 - plotHeight / 2 - offset,
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
    .padding(0.2);
  const xDecadeAxis = d3.axisBottom(xDecade).tickFormat((d, i) => {
    if (i === 0) return "~1950s";
    else return d;
  });
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
  const xDirectorAxis = d3
    .axisBottom(xDirector)
    .tickFormat((d) => `${d} Director`);
  const xDirectorAxisGroup = svg
    .select("g.x-axis-director")
    .style("transform", `translateY(${scatterYRange[0]}px)`)
    .call(xDirectorAxis);

  xDirectorAxisGroup.attr("opacity", 0);

  // x axis - decade
  const xBechdel = d3
    .scaleBand()
    .domain(bechdelDomain)
    .range([leftMargin, width])
    .padding(0.5);
  const xBechdelAxis = d3.axisBottom(xBechdel);
  const xBechdelAxisGroup = svg
    .select("g.x-axis-bechdel")
    .style("transform", `translateY(${scatterYRange[0]}px)`)
    .call(xBechdelAxis);

  xBechdelAxisGroup.attr("opacity", 0);

  // y axis = bechdel
  const yBechdel = d3.scaleBand().domain(bechdelDomain).range(scatterYRange);

  const yBechdelAxis = d3.axisLeft(yBechdel).tickFormat((d) => `${d}`);
  const yBechdelAxisGroup = svg
    .select("g.y-axis-bechdel")
    .style("transform", `translateX(${leftMargin}px)`)
    .call(yBechdelAxis);
  yBechdelAxisGroup.attr("opacity", 0);

  // y axis count
  const yCount = d3.scaleLinear().domain([0, 100]).range(scatterYRange);
  const yCountAxis = d3
    .axisLeft(yCount)
    .tickFormat((d) => `${d}%`)
    .ticks(4);
  const yCountAxisGroup = svg
    .select("g.y-axis-count")
    .style(
      "transform",
      `translateX(${leftMargin + xDecade.bandwidth() / 2 + 10}px)`
    )
    .call(yCountAxis);

  yCountAxisGroup.attr("opacity", 0);

  // y axis count
  const yPoster = d3.scaleLinear().domain([0, 100]).range(scatterYRange);
  const yPosterAxis = d3
    .axisLeft(yPoster)
    .tickFormat((d) => `${d}%`)
    .ticks(4);
  const yPosterAxisGroup = svg
    .select("g.y-axis-poster")
    .style("transform", `translateX(${leftMargin}px)`)
    .call(yPosterAxis);

  yPosterAxisGroup.attr("opacity", 0);

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
      yPoster?: boolean;
      xBechdel?: boolean;
    }
  ) => {
    const opt = {
      yBechdel: true,
      yGenre: true,
      xYear: true,
      yCount: true,
      xDecade: true,
      xDirector: true,
      yPoster: true,
      xBechdel: true,
      ...option,
    };
    opt.yBechdel &&
      yBechdelAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
    opt.yGenre &&
      yGenreAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
    opt.yCount &&
      yCountAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
    opt.xYear &&
      xYearAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
    opt.xDecade &&
      xDecadeAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
    opt.xDirector &&
      xDirectorAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
    opt.yPoster &&
      yPosterAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
    opt.xBechdel &&
      xBechdelAxisGroup
        // .transition().duration(duration)
        .attr("opacity", 0);
  };

  return {
    resetAxis,
    plotHeight,
    leftMargin,
    scatterYRange,
    // genreYRange,
    xYear,
    xYearAxisGroup,
    xDecade,
    xDecadeAxisGroup,
    yBechdel,
    yBechdelAxisGroup,
    yCount,
    yCountAxisGroup,
    yGenre,
    yGenreAxisGroup,
    xDirector,
    xDirectorAxisGroup,
    yPoster,
    yPosterAxisGroup,
    xBechdel,
    xBechdelAxisGroup,
  };
};

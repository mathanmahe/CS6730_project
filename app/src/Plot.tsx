import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { useResponsiveChart } from "./hooks/useResponsiveChart";
import "./Plot.scss";
import { getAxis } from "./utils/axis";
import {
  data,
  bechdelDomain,
  decadesDomain,
  genreDomain,
  allGenreData,
  filteredGenreDomain,
  filteredGenreData,
  directorsDomain,
} from "./utils/data";
import { prepareStackedArea } from "./utils/stackedArea";
import { prepareGenreUnits, prepareUnits } from "./utils/unitVis";
import { beeswarmForce, getBeeswarmData } from "./utils/beeswarmForce";
import classNames from "classnames";

const Plot = ({ activeStep }: { activeStep: number }) => {
  const { width, height, svgRef, getContainerSize } = useResponsiveChart();
  const [functionMap, setFunctionMap] = useState<Record<string, () => void>>(
    {}
  );
  const tooltipRef = useRef();
  const [tooltipData, setTooltipData] = useState();

  useEffect(() => {
    if (!width || !height) return;

    // Selection
    const svg = d3.select(svgRef.current);

    const {
      resetAxis,
      plotHeight,
      leftMargin,
      scatterYRange,
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
    } = getAxis({
      svg,
      data,
      height,
      width,
      decadesDomain,
      bechdelDomain,
      genreDomain: filteredGenreDomain,
      directorsDomain,
    });

    // color scale
    const bechdelColorScale = d3
      .scaleOrdinal()
      .domain(bechdelDomain)
      .range(["#27A7C1", "#B4DFED", "#F9CBD4", "#E35E6D"]);

    // Scatter plot marks
    const { marksGroup, marks, resetMarks } = prepareUnits({
      svg,
      data,
      bechdelColorScale,
    });
    // Scatter plot marks of all genre flattend
    const { genreMarksGroup, genreMarks, resetGenreMarks } = prepareGenreUnits({
      svg,
      data: filteredGenreData,
      bechdelColorScale,
    });
    // bechdel over time stacked area
    const {
      decadeGroup,
      areaTransitionEnd,
      areaTransitionStart,
      stacked,
      resetStackedArea,
    } = prepareStackedArea({
      svg,
      data,
      decadesDomain,
      bechdelDomain,
      xDecade,
      yCount,
      bechdelColorScale,
    });

    // Step0: title
    const showTitle = () => {
      // resetDialoguePlot(0);
      resetMarks(0, true);
      resetGenreMarks(0, false);
      resetAxis(0);
      resetStackedArea(0);

      const squareSizeW = 100;
      const squareSizeH = 140;
      const squarePad = 5;
      const numPerRow = Math.ceil(width / (squareSizeW + squarePad));

      const totalW = numPerRow * squareSizeW + (numPerRow - 1) * squarePad;
      const leftOffset = (totalW - width) / 2;

      marks
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 5 * i;
        })
        .attr("width", squareSizeW)
        .attr("height", squareSizeH)
        .attr("x", (d, i) => {
          const col = Math.floor(i % numPerRow);
          return col * (squareSizeW + squarePad) - leftOffset;
        })
        .attr("y", (d, i) => {
          const row = Math.floor(i / numPerRow);
          return row * (squareSizeH + squarePad);
        })
        .attr("opacity", 1);
    };

    // Step1: timeline unit
    const showStep1 = () => {
      // resetDialoguePlot();
      resetMarks(0, true);
      resetGenreMarks(0, false);
      resetAxis(0, { xDecade: false });
      resetStackedArea(0);

      xDecadeAxisGroup
        .transition()
        .duration(1000)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);

      const sizeW = xDecade.bandwidth();
      const sizeH = 10;
      const marginTop = 3;

      marks
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 3 * i;
        })
        .attr("width", sizeW)
        .attr("height", sizeH)
        .attr("x", (d) => xDecade(d.decade))
        .attr("y", (d) => {
          const offset = scatterYRange[0] - sizeH - 5;
          const yearIdx = decadeGroup
            .get(d.decade)
            .findIndex((groupItem) => groupItem.id === d.id);
          return offset + yearIdx * (sizeH + marginTop) * -1;
        })
        .attr("opacity", 1);
    };

    // Step2: bechdel + time alluvial
    const showStep2 = () => {
      // resetDialoguePlot();
      // resetMarks(0, true);
      resetGenreMarks(0, false);
      resetAxis(600, { xDecade: false, yCount: false });
      // resetStackedArea(0);

      xDecadeAxisGroup
        .transition()
        .duration(1000)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);
      yCountAxisGroup.transition().duration(1600).attr("opacity", 1);
      // .style("transform", `translateX(${10}px)`);

      // remove mark
      marks
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 3 * i;
        })
        .attr("y", scatterYRange[0] - 20)
        .attr("opacity", 0);

      // show area
      stacked
        .attr("d", areaTransitionStart)
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .delay((d, i) => {
          return 300 + 50 * i;
        })
        .attr("d", areaTransitionEnd);
    };

    // step3: beeswarm gere + time
    const genreDecadeGrossBeeswarmData = getBeeswarmData({
      data: filteredGenreData,
      x: (d) => xDecade(d.decade) + xDecade.bandwidth() / 2,
      y: (d) => yGenre(d.genre) + yGenre.bandwidth() / 2,
      sizeAttribute: "worldGross",
      yStrength: 10,
    });

    const showStep3 = () => {
      resetAxis(600, { yGenre: false, xDecade: false });
      resetMarks(0, false);
      resetGenreMarks(0, true);

      yGenreAxisGroup.transition().duration(600).attr("opacity", 1);
      xDecadeAxisGroup
        .transition()
        .duration(600)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);

      // hide stacked
      stacked
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 50 * i;
        })
        .attr("d", areaTransitionStart);

      // show unit
      genreMarks
        .attr("x", (d) => xDecade(d.decade))
        .attr("y", scatterYRange[0] - 20)
        .attr("width", (d, i) => genreDecadeGrossBeeswarmData[i].r)
        .attr("height", (d, i) => genreDecadeGrossBeeswarmData[i].r)
        .attr("opacity", 1)
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 300 + 2 * i;
        })
        .attr("x", (d, i) => genreDecadeGrossBeeswarmData[i].x)
        .attr("y", (d, i) => genreDecadeGrossBeeswarmData[i].y);
    };

    // step4: director gender + genre
    const genreDirectorGrossBeeswarmData = getBeeswarmData({
      data: filteredGenreData,
      x: (d) =>
        xDirector(
          d.directorList.every((director) => director.gender === "Male")
            ? "Male"
            : "Female"
        ) +
        xDirector.bandwidth() / 2,
      y: (d) => yGenre(d.genre) + yGenre.bandwidth() / 2,
      sizeAttribute: "worldGross",
      yStrength: 1,
    });

    const showStep4 = () => {
      resetAxis(600, { yGenre: false, xDirector: false });
      resetMarks(0, false);
      resetStackedArea(0);

      yGenreAxisGroup.transition().duration(600).attr("opacity", 1);
      xDirectorAxisGroup
        .transition()
        .duration(600)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);

      // show unit
      genreMarks
        .attr("width", (d, i) => genreDirectorGrossBeeswarmData[i].r)
        .attr("height", (d, i) => genreDirectorGrossBeeswarmData[i].r)
        .attr("opacity", 1)
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 300 + 2 * i;
        })
        .attr("x", (d, i) => genreDirectorGrossBeeswarmData[i].x)
        .attr("y", (d, i) => genreDirectorGrossBeeswarmData[i].y);
    };

    // Step5: Select 2 movies.
    const showStep5 = () => {
      // resetDialoguePlot(0);
      resetAxis();
      resetMarks(0, false);
      resetStackedArea(0);

      const size = 50;
      genreMarks
        .transition()
        .duration(300)
        .delay((d, i) => {
          return 2 * i;
        })
        .attr("opacity", (d, i) => {
          //TODO use movie id
          if (i === 0 || i === 1) return 1;
          else return 0;
        })
        .on("end", () => {
          svg
            .selectAll(".genre-mark.compare")
            .transition()
            .duration(500)
            .attr("width", size)
            .attr("height", size);
        });
    };

    // Step6: Explain dialog analysis.
    // const dialogueContainer = d3.select(".dialogue-container");
    // const scriptBoxWidth = 200;
    // const scriptBoxGap = 200;

    // const showStep6 = () => {
    //   // resetDialoguePlot();

    //   dialogueContainer
    //     .selectAll("p")
    //     .style("background-color", "transparent")
    //     .style("color", "#fff");

    //   dialogueContainer.style("gap", scriptBoxGap + "px");
    //   dialogueContainer
    //     .selectAll(`.dialogue`)
    //     .style("transform", `translateX(${leftMargin}px)`)
    //     .style("width", scriptBoxWidth + "px")
    //     .style("font-size", 13 + "px");

    //   svg
    //     .selectAll(".mark.compare")
    //     .transition()
    //     .duration(400)
    //     .attr("x", (d, i) => leftMargin + i * scriptBoxWidth + i * scriptBoxGap)
    //     .attr("y", 0)
    //     .attr("width", scriptBoxWidth)
    //     .transition()
    //     .duration(500)
    //     .attr(
    //       "height",
    //       (d, i) =>
    //         dialogueContainer.select(`.dialogue.movie-${i}`)?.node()
    //           ?.clientHeight
    //     )
    //     .attr("opacity", 1)
    //     .on("end", () => {
    //       dialogueContainer.transition().duration(400).style("opacity", 1);
    //     })
    //     .transition()
    //     .duration(400)
    //     .attr("opacity", 0);
    // };

    setFunctionMap({
      0: showTitle,
      1: showStep1,
      2: showStep2,
      3: showStep3,
      4: showStep4,
      // script alanysis
      5: showStep5,
      // 6: showStep6,
      // 7: showStep7,
      // 8: showStep8,
    });
  }, [width, height, data]);

  useEffect(() => {
    console.log("activeStep", activeStep);
    functionMap?.[activeStep]?.();
  }, [activeStep, functionMap]);

  return (
    <div
      className="chart"
      style={{
        width: "100%",
        height: "100%",
        padding: "100px",
      }}
    >
      <svg
        ref={(r) => {
          svgRef.current = r;
          getContainerSize();
        }}
      >
        <g className="axis y-axis y-axis-bechdel"></g>
        <g className="axis y-axis y-axis-genre"></g>
        <g className="axis y-axis y-axis-count"></g>
        <g className="axis x-axis x-axis-year"></g>
        <g className="axis x-axis x-axis-decade"></g>
        <g className="axis x-axis x-axis-director"></g>
        <g className="marks"></g>
        <g className="genre-marks"></g>
        <g className="stacks"></g>
        <g className="dialogue-plots-group"></g>
      </svg>
      {/* <div className="dialogue-container">
        {dialogueDataset.map(({ title, data }, i) => (
          <div className={classNames("dialogue", `movie-${i}`)} key={i}>
            {data.map((d) => (
              <p
                key={d.id}
                className={classNames({
                  female: d.gender === "F",
                  male: d.gender === "M",
                })}
              >
                {d.line + " "}
              </p>
            ))}
          </div>
        ))}
      </div> */}
      {tooltipData && (
        <div
          className="tooltip"
          ref={tooltipRef}
          style={{ left: tooltipData.left, top: tooltipData.top }}
        >
          <div className="title">{tooltipData.title}</div>
        </div>
      )}
    </div>
  );
};

export default Plot;

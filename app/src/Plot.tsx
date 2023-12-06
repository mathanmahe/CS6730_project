import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { useResponsiveChart } from "./hooks/useResponsiveChart";
import "./Plot.scss";
import { getAxis } from "./utils/axis";
import {
  data,
  bechdelDomain,
  decadesDomain,
  filteredGenreDomain,
  filteredGenreData,
  directorsDomain,
} from "./utils/data";
import { prepareStackedArea } from "./utils/stackedArea";
import { prepareGenreUnits, prepareUnits } from "./utils/unitVis";
import { getBeeswarmData } from "./utils/beeswarmForce";
import classNames from "classnames";
import { prepareDialoguePlot } from "./utils/dialogue";
import dialogueSampleData from "./assets/dialogue-sample.json";
import { getFemalePercentage, splitArray } from "./utils/script";

const chunkSize = 100;
export const chunkedSampleDataset = dialogueSampleData.map(
  ({ title, lines }) => {
    const chunk = splitArray(lines, chunkSize);
    return {
      title,
      data: chunk.map((d, i) => ({
        chunkIndex: i,
        data: d,
        femalePercentage: getFemalePercentage(d),
      })),
    };
  }
);
const sampleTitles = dialogueSampleData.map((d) => d.title);

const Plot = ({
  activeStep,
  dashboardActive,
  sizeFactor,
  setSizeFactor,
}: {
  activeStep: string;
}) => {
  const { width, height, svgRef, getContainerSize } = useResponsiveChart();
  const [functionMap, setFunctionMap] = useState<Record<string, () => void>>(
    {}
  );

  const tooltipRef = useRef();
  const [tooltipData, setTooltipData] = useState();

  const containerRef = useRef();

  useEffect(() => {
    if (!width || !height) return;
    const plotHeight = height * 0.8;
    const leftMargin = width * 0.5;

    // Selection
    const containerDiv = d3.select(containerRef.current);
    const svg = d3.select(svgRef.current);

    const {
      resetAxis,
      scatterYRange,
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
    } = getAxis({
      plotHeight,
      leftMargin,
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
      .range(["#666", "#27A7C1", "#B4DFED", "#F9CBD4", "#E35E6D"]);

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

    // 2 movies comparison bins
    const { dialogueContainer, dialoguePlotGroup, resetDialoguePlot } =
      prepareDialoguePlot({
        data: chunkedSampleDataset,
        svg,
      });

    const tooltip = d3.select(tooltipRef.current);

    // marks
    //   .on("mouseover", (e, d) => {
    //     setTooltipData(d);
    //     tooltip
    //       .style("left", e.clientX + 20 + "px")
    //       .style("top", e.clientY + 20 + "px")
    //       .style("opacity", 1);
    //   })
    //   .on("mouseout", (d) => {
    //     tooltip.style("opacity", 0);
    //   });

    // genreMarks
    //   .on("mouseover", (e, d) => {
    //     setTooltipData(d);
    //     tooltip
    //       .style("left", e.clientX + 20 + "px")
    //       .style("top", e.clientY + 20 + "px")
    //       .style("opacity", 1);
    //   })
    //   .on("mouseout", (d) => {
    //     tooltip.style("opacity", 0);
    //   });

    //legend
    const legendGroup = containerDiv
      .select(".bechdel-legend")
      .style("opacity", 0);

    legendGroup.selectAll(".chip").style("background", (d, i) => {
      return bechdelColorScale(bechdelDomain[i]);
    });

    const showLegend = () => {
      legendGroup.transition().duration(600).style("opacity", 1);
    };
    const hideLegend = () => {
      legendGroup.transition().duration(600).style("opacity", 0);
    };

    // axis styling
    xDecadeAxisGroup.selectAll(".tick line").attr("opacity", 0);
    xDecadeAxisGroup.selectAll(".tick text").attr("dy", "2%");

    //for step0
    const squareSizeW = Math.max(100, Math.floor(width / 12));
    const squareSizeH = squareSizeW * 1.5;
    const squarePad = squareSizeW * 0.1;
    const numPerRow = Math.ceil(width / (squareSizeW + squarePad)) + 2;

    const totalW = numPerRow * squareSizeW + (numPerRow - 1) * squarePad;
    const leftOffset = (totalW - width) / 2;
    const topOffset = -50;

    const posters = containerDiv.selectAll("div.unit-poster");
    // Step0: title
    const showTitle = () => {
      resetDialoguePlot(0);
      resetMarks(0, false);
      resetGenreMarks(0, false);
      resetAxis(0);
      resetStackedArea(0);
      hideLegend();

      posters
        .style("opacity", 1)
        .style("width", squareSizeW + "px")
        .style("top", (d, i) => {
          const row = Math.floor(i / numPerRow);
          return row * (squareSizeH + squarePad) + topOffset + "px";
        })
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 5 * i;
        })
        .style("left", (d, i) => {
          const col = Math.floor(i % numPerRow);
          return col * (squareSizeW + squarePad) - leftOffset + "px";
        })
        .style("height", squareSizeH + "px");

      marks
        .attr("width", squareSizeW)
        .attr("y", (d, i) => {
          const row = Math.floor(i / numPerRow);
          return row * (squareSizeH + squarePad) + topOffset;
        })
        .attr("x", (d, i) => {
          const col = Math.floor(i % numPerRow);
          return col * (squareSizeW + squarePad) - leftOffset;
        })
        .attr("height", squareSizeH)
        .attr("opacity", 0);
      // .on("interrupt", () => {
      //   console.log("unit interrupt");
      // })
      // .on("end", () => {
      //   console.log("unit end");
      // })
      // .on("cancel", () => {
      //   console.log("unit canceled");
      // });
    };
    // Step1: timeline unit
    const showStep1 = () => {
      resetDialoguePlot(0);
      resetMarks(0, false);
      resetGenreMarks(0, false);
      resetAxis(0, { xDecade: false });
      resetStackedArea(0);
      showLegend();

      xDecadeAxisGroup.selectAll(".tick line").attr("opacity", 0);

      xDecadeAxisGroup
        .transition()
        .duration(1000)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);

      const sizeW = xDecade.bandwidth();
      const sizeH = plotHeight / 50 - 3;
      const marginTop = 3;

      posters
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 3 * i;
        })
        .style("opacity", 0)
        .style("width", sizeW + "px")
        .style("height", sizeH + "px")
        .style("left", (d, i) => xDecade(decadesDomain[i % 5]) + "px")
        .style("top", (d, i) => {
          const offset = scatterYRange[0] - sizeH - 5;
          const yearIdx = 0;
          return offset + yearIdx * (sizeH + marginTop) * -1 + "px";
        });

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
      showLegend();
      resetDialoguePlot(0);
      resetGenreMarks(0, false);
      resetAxis(600, { xDecade: false, yCount: false });

      xDecadeAxisGroup
        .selectAll(".tick line")
        .attr("opacity", 0.2)
        .attr("y1", -1 * plotHeight);

      yCountAxisGroup
        .selectAll(".tick line")
        .attr("opacity", 0.2)
        .attr("x1", width - leftMargin - xDecade.bandwidth());

      xDecadeAxisGroup
        .transition()
        .duration(1000)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);

      yCountAxisGroup.transition().duration(1600).attr("opacity", 1);
      yCountAxisGroup
        .selectAll(".tick text")
        .attr("dy", (d, i) => (i === 0 ? -14 : 10));
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

    const beeswarmSizeRange = [
      xDecade.bandwidth() * 0.1,
      xDecade.bandwidth() * 0.4,
    ];
    // step3: beeswarm gere + time
    const genreDecadeGrossBeeswarmData = getBeeswarmData({
      data: filteredGenreData,
      x: (d) => xDecade(d.decade) + xDecade.bandwidth() / 2,
      y: (d) => yGenre(d.genre) + yGenre.bandwidth() / 2,
      sizeAttribute: xDecade.bandwidth() * 0.1,
      yStrength: 12,
      sizeRange: beeswarmSizeRange,
    });

    const showStep3 = () => {
      showLegend();
      resetDialoguePlot(0);
      resetAxis(600, { yGenre: false, xDecade: false });
      resetMarks(0, false);

      yGenreAxisGroup.transition().duration(600).attr("opacity", 1);
      xDecadeAxisGroup
        .transition()
        .duration(600)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);
      yGenreAxisGroup.selectAll(".tick line").remove();
      yGenreAxisGroup.selectAll(".tick text").attr("dx", -10);

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

      setSizeFactor("none");
    };

    const updateBeeswarm = (sizeFactor) => {
      const beeswarmData = getBeeswarmData({
        data: filteredGenreData,
        x: (d) => xDecade(d.decade) + xDecade.bandwidth() / 2,
        y: (d) => yGenre(d.genre) + yGenre.bandwidth() / 2,
        sizeAttribute:
          sizeFactor === "none" ? xDecade.bandwidth() * 0.1 : sizeFactor,
        yStrength: 10,
        sizeRange: beeswarmSizeRange,
      });

      genreMarks
        .transition()
        .duration(400)
        .delay((d, i) => {
          return 2 * i;
        })
        .attr("width", (d, i) => beeswarmData[i].r)
        .attr("height", (d, i) => beeswarmData[i].r)
        .attr("x", (d, i) => beeswarmData[i].x)
        .attr("y", (d, i) => beeswarmData[i].y);
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
      sizeAttribute: xDecade.bandwidth() * 0.1,
      yStrength: 10,
      sizeRange: beeswarmSizeRange,
    });

    const showStep4 = () => {
      showLegend();
      resetAxis(600, {
        yGenre: false,
        xDirector: false,
      });
      resetMarks(0, false);
      resetStackedArea(0);
      resetDialoguePlot(0);
      containerDiv.selectAll(".unit-poster.compare").style("opacity", 0);

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
      hideLegend();
      resetDialoguePlot(0);
      resetAxis(0);
      resetMarks(0, false);
      resetStackedArea(0);

      const compareSize = width * 0.2;

      genreMarks
        .transition()
        .duration(300)
        .delay((d, i) => {
          return 2 * i;
        })
        .attr("opacity", (d, i) => {
          if (sampleTitles.includes(d.title) && d.genre === "Adventure")
            return 1;
          else return 0;
        })
        .on("end", () => {
          svg
            .selectAll(".genre-mark.compare")
            .transition()
            .duration(500)
            .attr("width", compareSize)
            .attr("height", compareSize * 1.5)
            .attr(
              "x",
              (d, i) => leftMargin + compareSize * i + (compareSize / 2) * i
            )
            .attr("y", height / 2 - compareSize)
            .on("end", () => {
              showNext();
            });
          // .attr("fill", "#000");

          // containerDiv
          //   .selectAll("div.sample-posters .poster")
          //   .style("border", "1px solid #fff")
          //   .style("width", compareSize + "px")
          //   .style("height", compareSize * 1.5 + "px")
          //   .style(
          //     "left",
          //     (d, i) =>
          //       leftMargin + compareSize * i + (compareSize / 2) * i + "px"
          //   )
          //   .style("top", height / 2 - compareSize * 0.5 + "px")

          // containerDiv
          //   .selec("div.sample-posters")
          //   .transition()
          //   .duration(500)
          //   .delay(500)
          //   .style("opacity", 1);
        });
    };

    // Step6: Explain dialog analysis.
    const scriptBoxWidth = width / 5;
    const scriptBoxGap = scriptBoxWidth / 3;

    const showNext = () => {
      hideLegend();
      resetMarks(0, false);
      resetAxis(0);
      resetStackedArea(0);
      // resetDialoguePlot();

      dialogueContainer
        .selectAll("p")
        .style("background-color", "transparent")
        .style("color", "#fff");

      dialogueContainer.style("gap", scriptBoxGap + "px");
      dialogueContainer
        .selectAll(`.dialogue`)
        .style("transform", `translateX(${leftMargin}px)`)
        .style("width", scriptBoxWidth + "px")
        .style("font-size", 1 + "vw");

      svg
        .selectAll(".genre-mark.compare")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => leftMargin + i * scriptBoxWidth + i * scriptBoxGap)
        .attr("y", 0)
        .attr("width", scriptBoxWidth)
        .transition()
        .duration(1000)
        .attr(
          "height",
          (d, i) =>
            dialogueContainer.select(`.dialogue.movie-${i}`)?.node()
              ?.clientHeight
        )
        .attr("opacity", 1)
        .on("end", () => {
          dialogueContainer.transition().duration(400).style("opacity", 1);
        })
        .transition()
        .duration(600)
        .attr("opacity", 0);
    };

    // Step7: Explain dialog analysis.
    const showStep7 = () => {
      resetDialoguePlot(0, true);
      resetMarks(0, false);
      resetGenreMarks(0, false);
      resetAxis(0);
      resetStackedArea(0);

      dialogueContainer.transition().duration(200).style("opacity", 1);
      svg.selectAll(".genre-mark.compare").attr("opacity", 0);

      dialogueContainer
        .selectAll(`.dialogue`)
        .style("font-size", 1 + "vw")
        .transition()
        .duration(1000)
        .style("font-size", 0.15 + "vw")
        .on("end", (_, idx, nodes) => {
          dialogueContainer
            .selectAll("p.female")
            .transition()
            .delay(600)
            .duration(1000)
            .style("color", "#E35E6D")
            .style("background-color", "#E35E6D");

          dialogueContainer
            .selectAll("p.non-female")
            .transition()
            .delay(600)
            .duration(1000)
            .style("color", "#000");
          dialogueContainer
            .selectAll(`.dialogue`)
            .style("border", "1px solid #666");
        });
    };

    // Step8: Explain dialog analysis.
    const showStep8 = () => {
      resetMarks(0, false);
      resetGenreMarks(0, false);
      resetAxis(0);
      resetStackedArea(0);

      dialogueContainer
        .transition()
        .delay(1000)
        .duration(1000)
        .style("opacity", 0);

      const divs = dialogueContainer.selectAll(`.dialogue`).nodes();

      divs.forEach((div, idx) => {
        const boxHeight = div?.clientHeight;
        const chunkHeight = boxHeight / chunkSize;
        const dialoguePlot = dialoguePlotGroup.select(
          `g.dialogue-plot.movie-${idx}`
        );

        const binSize = (width * 0.4) / (2 * 10);
        const binPad = 0;
        const numPerRow = Math.sqrt(chunkSize);
        const boxPosX = idx * scriptBoxWidth + idx * scriptBoxGap;

        const marginTop = (height - binSize * 10) / 2 - 30;

        const pad = 0;
        dialoguePlot
          .selectAll("rect")
          .attr(
            "x",
            leftMargin + idx * scriptBoxWidth + idx * scriptBoxGap - pad
          )
          .attr("y", (d, i) => i * chunkHeight)
          .attr("width", 0)
          .attr("height", chunkHeight)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.2)
          .attr("fill-opacity", 0)
          .attr("fill", "#E35E6D")
          .transition()
          .duration(1000)
          .attr("width", scriptBoxWidth + pad * 2)
          .transition()
          .duration(1000)
          .attr("fill-opacity", (d) => d.femalePercentage.toFixed(2))
          .transition()
          .duration(1000)
          .delay((d, i) => {
            return 10 * i;
          })
          .attr("width", binSize)
          .attr("height", binSize)
          .attr("x", (d, i) => {
            const col = Math.floor(i % numPerRow);
            return leftMargin + col * (binSize + binPad) + boxPosX;
          })
          .attr("y", (d, i) => {
            const row = Math.floor(i / numPerRow);
            return marginTop + row * (binSize + binPad);
          });
      });
    };

    const showStep10 = () => {
      resetAxis(0);
      resetMarks(0, false);
      resetGenreMarks(0, false);
      resetStackedArea(0);
      // resetDialoguePlot(600);
      dialoguePlotGroup
        .selectAll("rect")
        .transition()
        .duration(1000)
        .delay((d, i) => {
          return 2 * i;
        })
        .attr("width", 0)
        .attr("height", 0);
    };

    setFunctionMap({
      "0": showTitle,
      "1": showStep1,
      "2": showStep2,
      "3": showStep3,
      "4": showStep4,
      // script alanysis
      "5": showStep5,
      "6": showStep7,
      "7": showStep8,
      "8": () => {
        //sentiment
      },
      "9": showStep10,
      updateBeeswarm,
    });
  }, [width, height, data]);

  useEffect(() => {
    console.log("activeStep", activeStep);
    functionMap?.[activeStep]?.();
  }, [activeStep, functionMap]);

  useEffect(() => {
    functionMap?.["updateBeeswarm"]?.(sizeFactor);
  }, [sizeFactor]);

  useEffect(() => {
    const chart = d3.select("div.chart");
    if (dashboardActive.isIntersecting) {
      chart.style("visibility", "hidden");
    } else {
      chart.style("visibility", "visible");
    }
  }, [dashboardActive.isIntersecting]);

  return (
    <div className="chart" ref={containerRef}>
      <svg
        ref={(r) => {
          svgRef.current = r;
          getContainerSize();
        }}
      >
        <g className="marks"></g>
        <g className="genre-marks"></g>
        <g className="stacks"></g>
        <g className="dialogue-plots-group"></g>
        <g className="axis y-axis y-axis-bechdel"></g>
        <g className="axis y-axis y-axis-genre"></g>
        <g className="axis y-axis y-axis-count"></g>
        <g className="axis x-axis x-axis-year"></g>
        <g className="axis x-axis x-axis-decade"></g>
        <g className="axis x-axis x-axis-director"></g>
        <g className="axis x-axis y-axis-poster"></g>
        <g className="axis x-axis x-axis-bechdel"></g>
      </svg>
      <div className="dialogue-container">
        {dialogueSampleData.map(({ id, title, lines }, i) => (
          <div className={classNames("dialogue", `movie-${i}`)} key={id}>
            {lines.map((d) => (
              <p
                key={d.index}
                className={d.gender === "Female" ? "female" : "non-female"}
              >
                {d.line + " "}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="tooltip" ref={tooltipRef}>
        <div className="title">{tooltipData?.title}</div>
        <div className="date">{tooltipData?.releaseDate}</div>
        <div className="rating">{tooltipData?.imDbRating}</div>
      </div>
      <div className="unit-posters">
        {data.slice(0, 100).map((d) => (
          <div
            key={d.id}
            id={d.id}
            className={classNames("unit-poster")}
            style={{
              backgroundImage: `url("./posters/${d.rank}_${d.id}.jpg")`,
            }}
          ></div>
        ))}
      </div>

      <div className="bechdel-legend">
        <span>Bechdel Score</span>
        {bechdelDomain.map((d) => (
          <div key={d} className="legend-item">
            <span>{d}</span>
            <div className="chip" data-id={d}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plot;

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
  colorBechelMap,
  colorGenderMap,
  sizeExtentMap,
} from "./utils/data";
import { prepareStackedArea } from "./utils/stackedArea";
import { prepareGenreUnits, prepareUnits } from "./utils/unitVis";
import { getBeeswarmData } from "./utils/beeswarmForce";
import classNames from "classnames";
import { prepareDialoguePlot } from "./utils/dialogue";
import dialogueSampleData from "./assets/dialogue-sample.json";
import { getFemalePercentage, splitArray } from "./utils/script";
import { SentimentVis } from "./SentimentVis";
import { TooltipContent } from "./Dashboard";

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
  // const [functionMap, setFunctionMap] = useState<Record<string, () => void>>(
  //   {}
  // );
  const functionMap = useRef({});
  const prevStep = useRef(activeStep);
  const tooltipRef = useRef();
  const [tooltipData, setTooltipData] = useState();

  const containerRef = useRef();

  useEffect(() => {
    if (!width || !height) return;
    const plotHeight = height * 0.8;

    const windowW = window.innerWidth || document.documentElement.clientWidth;
    const viewportPaddingforAbsolutePosition =
      document.documentElement.clientWidth * 0.1;
    const leftMargin =
      document.documentElement.clientWidth > 700 ? width * 0.5 : width * 0.1;

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
      .range(bechdelDomain.map((d) => colorBechelMap[d]));

    // Scatter plot marks
    const { marksGroup, marks, resetMarks } = prepareUnits({
      svg,
      data,
      bechdelColorScale,
      containerDiv,
    });
    // Scatter plot marks of all genre flattend
    const { genreMarksGroup, genreMarks, resetGenreMarks } = prepareGenreUnits({
      svg,
      data: filteredGenreData,
      bechdelColorScale,
      containerDiv,
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
      containerDiv,
    });

    // 2 movies comparison bins
    const { dialogueContainer, dialoguePlotGroup, resetDialoguePlot } =
      prepareDialoguePlot({
        data: chunkedSampleDataset,
        svg,
        containerDiv,
      });

    const tooltip = d3.select(tooltipRef.current);

    const showTooltip = (e) => {
      const rect = tooltipRef.current.getBoundingClientRect();
      const left = e.clientX + 20;
      const isOut = left + rect.width > windowW;

      if (isOut) {
        tooltip
          .style("right", 20 + "px")
          .style("left", "unset")
          .style("top", e.clientY + 20 + "px")
          .style("visibility", "visible");
      } else {
        tooltip
          .style("left", e.clientX + 20 + "px")
          .style("right", "unset")
          .style("top", e.clientY + 20 + "px")
          .style("visibility", "visible");
      }
    };

    marks
      .on("mouseenter", (e, d) => {
        setTooltipData(d);
        showTooltip(e);
        d3.select(e.target).attr("stroke-width", 1).attr("stroke", "#fff");
      })
      .on("mouseleave", (e, d) => {
        tooltip.style("visibility", "hidden");
        d3.select(e.target).attr("stroke-width", 0);
      });

    let sameMovies;
    genreMarks
      .on("mouseenter", (e, d) => {
        setTooltipData(d);
        showTooltip(e);
        sameMovies = svg.selectAll(`rect.genre-mark.${d.id}`);
        sameMovies
          .attr("stroke-width", 6)
          .attr("stroke-location", "outside")
          .attr("stroke", "#fff");
      })
      .on("mouseleave", (e, d) => {
        tooltip.style("visibility", "hidden");
        sameMovies.attr("stroke-width", 0);
      });

    //legend
    const legendGroup = containerDiv
      .select(".bechdel-legend")
      .style("opacity", 0);

    legendGroup.selectAll(".chip").style("background", (d, i) => {
      return bechdelColorScale(bechdelDomain[i]);
    });

    //size - legend
    const sizeLegendGroup = containerDiv
      .select("div.size-legend")
      .style("visibility", "hidden")
      .style("opacity", 0);

    const showSizeLegend = () => {
      sizeLegendGroup
        .style("visibility", "visible")
        .transition()
        .duration(600)
        .style("opacity", 1);
    };
    const hideSizeLegend = () => {
      sizeLegendGroup
        .transition()
        .duration(600)
        .style("opacity", 0)
        .style("visibility", "hidden");
    };

    const showLegend = () => {
      legendGroup.transition().duration(600).style("opacity", 1);
    };
    const hideLegend = () => {
      hideSizeLegend();
      legendGroup.transition().duration(600).style("opacity", 0);
    };

    const sentimentChart = containerDiv.select(".sentiment-sample");

    const resetSentimentChart = () => {
      sentimentChart
        .interrupt()
        .style("visibility", "hidden")
        .style("opacity", 0);
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
    const leftOffset = (windowW - totalW) / 2;
    const topOffset = height * 0.05;

    const posters = containerDiv.selectAll("div.unit-poster");

    // Step0: title
    const showTitle = () => {
      //from whereever start again.
      resetDialoguePlot();
      resetMarks();
      resetGenreMarks();
      resetAxis();
      resetStackedArea();
      resetSentimentChart();
      hideLegend();

      posters
        .style("opacity", 1)
        .style("width", squareSizeW + "px")
        .style("top", (d, i) => {
          const row = Math.floor(i / numPerRow);
          return row * (squareSizeH + squarePad) + topOffset + "px";
        })
        .transition()
        .duration(1000)
        .delay((d, i) => {
          return 5 * i;
        })
        .style("left", (d, i) => {
          const col = Math.floor(i % numPerRow);
          return col * (squareSizeW + squarePad) + leftOffset + "px";
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
          return col * (squareSizeW + squarePad) + leftOffset;
        })
        .attr("height", squareSizeH)
        .attr("opacity", 0);
    };

    // Step1: timeline unit
    const showTimeline = ({ isBackward }) => {
      // from wherever, show mark and xaxis
      resetDialoguePlot();
      // resetMarks({ onlyPoster: true });
      resetGenreMarks();
      resetAxis({ xDecade: false });
      resetStackedArea();
      hideLegend();
      resetSentimentChart();

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
        .duration(1000)
        .delay((d, i) => {
          return 5 * i;
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
        .attr("pointer-events", "all")
        .transition()
        .duration(1000)
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
        .attr("opacity", 1)
        .attr("fill", bechdelColorScale("NA"));
    };

    // Step2: timeline unit w/ color
    const showTimelineBechdelColor = ({ isBackward }) => {
      // from wherever, show mark and xaxis
      resetDialoguePlot();
      resetMarks({ onlyPoster: true });
      resetGenreMarks();
      resetAxis({ xDecade: false });
      resetStackedArea();
      resetSentimentChart();

      showLegend();
      hideSizeLegend();
      if (isBackward) {
        const sizeH = plotHeight / 50 - 3;
        const marginTop = 3;
        marks
          .attr("x", (d) => xDecade(d.decade))
          .attr("y", (d) => {
            const offset = scatterYRange[0] - sizeH - 5;
            const yearIdx = decadeGroup
              .get(d.decade)
              .findIndex((groupItem) => groupItem.id === d.id);
            return offset + yearIdx * (sizeH + marginTop) * -1;
          });
      }

      marks
        .attr("opacity", 1)
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 3 * i;
        })
        .attr("fill", (d) => bechdelColorScale(d.BechdelRating) as string);
    };

    // Step3: bechdel time stack area
    const showBechdelTimelineArea = () => {
      // from wherever, show stack and xaxis
      resetDialoguePlot();
      resetMarks({ onlyPoster: true });
      resetGenreMarks();
      resetAxis({ xDecade: false, yCount: false });
      resetSentimentChart();

      showLegend();
      hideSizeLegend();

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

    // step4: beeswarm
    const beeswarmSizeRange = [
      xDecade.bandwidth() * 0.1,
      xDecade.bandwidth() * 0.4,
    ];

    const genreDecadeBeeswarmData = getBeeswarmData({
      data: filteredGenreData,
      x: (d) => xDecade(d.decade) + xDecade.bandwidth() / 2,
      y: (d) => yGenre(d.genre) + yGenre.bandwidth() / 2,
      sizeAttribute: xDecade.bandwidth() * 0.1,
      yStrength: 12,
      sizeRange: beeswarmSizeRange,
    });

    const showBeeswarmChart = (beeswarmData) => () => {
      // from wherever, show genre mark and xaxis
      resetDialoguePlot();
      resetMarks();
      resetAxis({ xDecade: false, yGenre: false });
      resetStackedArea();
      resetSentimentChart();

      showLegend();
      showSizeLegend();

      stacked
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 50 * i;
        })
        .attr("d", areaTransitionStart);

      xDecadeAxisGroup.transition().duration(600).attr("opacity", 1);

      xDecadeAxisGroup.selectAll(".tick line").attr("opacity", 0);

      yGenreAxisGroup.transition().duration(600).attr("opacity", 1);
      yGenreAxisGroup.selectAll(".tick text").attr("dx", -10);
      yGenreAxisGroup
        .selectAll(".tick line")
        .attr("opacity", 0.2)
        .attr("x1", width - leftMargin - xDecade.bandwidth());

      // show unit
      genreMarks
        .attr("pointer-events", "all")
        .attr("x", (d) => xDecade(d.decade))
        .attr("y", scatterYRange[0] - 20)
        .attr("width", (d, i) => beeswarmData[i].r)
        .attr("height", (d, i) => beeswarmData[i].r)
        .attr("opacity", 1)
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 300 + 2 * i;
        })
        .attr("x", (d, i) => beeswarmData[i].x)
        .attr("y", (d, i) => beeswarmData[i].y);

      // setSizeFactor("none");
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

      const genreDirectorBeeswarmData = getBeeswarmData({
        data: filteredGenreData,
        x: (d) =>
          xDirector(
            d.directorList.every((director) => director.gender === "Male")
              ? "Male"
              : "Female"
          ) +
          xDirector.bandwidth() / 2,
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

      //update story function
      functionMap.current = {
        ...functionMap.current,
        "4": showBeeswarmChart(beeswarmData),
        "5": showDirectorBeeswarm(genreDirectorBeeswarmData),
      };
    };

    // step5: director gender beeswarm
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

    const showDirectorBeeswarm = (beeswarmData) => () => {
      // from wherever, show mark and xaxis
      resetAxis({
        yGenre: false,
        xDirector: false,
      });
      resetDialoguePlot();
      resetMarks();
      resetStackedArea();
      resetSentimentChart();

      showLegend();
      showSizeLegend();

      yGenreAxisGroup.transition().duration(600).attr("opacity", 1);

      xDirectorAxisGroup
        .transition()
        .duration(600)
        .attr("opacity", 1)
        .style("transform", `translateY(${scatterYRange[0]}px)`);

      // show unit
      genreMarks
        .attr("width", (d, i) => beeswarmData[i].r)
        .attr("height", (d, i) => beeswarmData[i].r)
        .attr("opacity", 1)
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 300 + 2 * i;
        })
        .attr("x", (d, i) => beeswarmData[i].x)
        .attr("y", (d, i) => beeswarmData[i].y);
    };

    // Step6: Script analysis
    const compareSize = width * 0.2;
    const compareMarks = svg.selectAll(".genre-mark.compare");

    const showSelectMovie = ({ isBackward }) => {
      // from wherever, show 2 selected mark, sample poster, dialogue div
      resetDialoguePlot({ onlyPlot: isBackward ? false : true });
      resetMarks();
      // resetGenreMarks();
      resetAxis();
      resetStackedArea();
      resetSentimentChart();

      hideLegend();

      genreMarks
        .attr("width", (d, i) => genreDirectorGrossBeeswarmData[i].r)
        .attr("height", (d, i) => genreDirectorGrossBeeswarmData[i].r)
        .attr("pointer-events", "none")
        .attr("opacity", 1)
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
          compareMarks
            .transition()
            .duration(500)
            .attr("width", compareSize)
            .attr("height", compareSize * 1.5)
            .attr("x", (d, i) => {
              const center = leftMargin + (width - leftMargin) / 2;
              const gap = compareSize * 0.2;
              if (i === 0) return center - compareSize - gap;
              if (i === 1) return center + gap;
            })
            .attr("y", height / 2 - (compareSize * 1.5) / 2)
            .on("end", () => {
              showSmaplePosters();
            });
        });
    };

    const samplePosterGroup = containerDiv.select("div.sample-posters");

    const showSmaplePosters = () => {
      samplePosterGroup
        .selectAll(".sample-poster")
        .style("border", "1px solid #fff")
        .style("width", compareSize + "px")
        .style("height", compareSize * 1.5 + "px")
        .style("left", (d, i) => {
          const center =
            viewportPaddingforAbsolutePosition +
            leftMargin +
            (width - leftMargin) / 2;
          const gap = compareSize * 0.2;
          if (i === 0) return center - compareSize - gap + "px";
          if (i === 1) return center + gap + "px";
        })
        .style(
          "top",
          viewportPaddingforAbsolutePosition +
            height / 2 -
            (compareSize * 1.5) / 2 +
            "px"
        );

      samplePosterGroup
        .transition()
        .duration(500)
        .style("opacity", 1)
        .on("end", () => {
          compareMarks.attr("opacity", 0);
          showScript();
        });
    };

    const scriptBoxWidth = width * 0.2;
    // const scriptBoxGap = scriptBoxWidth;

    const dialogueContainerInitial = () => {
      dialogueContainer
        .selectAll("p")
        .style("background-color", "transparent")
        .style("color", "#fff");

      dialogueContainer
        .selectAll(".dialogue")
        .style("opacity", 1)
        .style("left", (d, i) => {
          const center =
            viewportPaddingforAbsolutePosition +
            leftMargin +
            (width - leftMargin) / 2;
          const gap = scriptBoxWidth * 0.2;
          if (i === 0) return center - scriptBoxWidth - gap + "px";
          if (i === 1) return center + gap + "px";
        })
        .style("top", viewportPaddingforAbsolutePosition + "px")
        .style("width", scriptBoxWidth + "px")
        .style("font-size", 0.7 + "rem");
    };
    dialogueContainerInitial();

    const showScript = () => {
      const sampleSize = compareSize / 3;
      samplePosterGroup
        .selectAll(".sample-poster")
        .transition()
        .duration(500)
        .style("width", sampleSize + "px")
        .style("height", sampleSize * 1.5 + "px")
        .style("left", (d, i) => {
          const center =
            viewportPaddingforAbsolutePosition +
            leftMargin +
            (width - leftMargin) / 2 -
            sampleSize * 1.1;
          const gap = scriptBoxWidth * 0.2;
          if (i === 0) return center - scriptBoxWidth - gap + "px";
          if (i === 1) return center + gap + "px";
        })
        .style("top", viewportPaddingforAbsolutePosition + "px");

      dialogueContainerInitial();

      dialogueContainer.transition().duration(600).style("opacity", 1);
    };

    // Step7: Explain dialog analysis.
    const showFemaleDialog = () => {
      //from whereever show dialogue
      resetDialoguePlot({ onlyPlot: true });
      resetMarks();
      resetGenreMarks();
      resetAxis();
      resetStackedArea();
      resetSentimentChart();
      hideLegend();

      dialogueContainer.transition().duration(200).style("opacity", 1);
      svg.selectAll(".genre-mark.compare").attr("opacity", 0);

      dialogueContainer
        .selectAll(`.dialogue`)
        .style("font-size", 0.7 + "rem")
        .transition()
        .duration(800)
        .style("font-size", 0.12 + "rem")
        .on("end", (_, idx, nodes) => {
          dialogueContainer
            .selectAll("p.female")
            .transition()
            .delay(300)
            .duration(1000)
            .style("color", colorGenderMap.female)
            .style("background-color", colorGenderMap.female);

          dialogueContainer
            .selectAll("p.non-female")
            .transition()
            .delay(300)
            .duration(1000)
            .style("color", "#000");
        });
    };

    // Step8: Segmentation
    const showSegmentDiagram = () => {
      //from whereever show dialogue plot
      // resetDialoguePlot({ onlyDiv: true });
      resetMarks();
      resetGenreMarks();
      resetAxis();
      resetStackedArea();
      resetSentimentChart();
      hideLegend();

      samplePosterGroup.transition().duration(600).style("opacity", 0);

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
        const boxPosX = idx * scriptBoxWidth + idx * scriptBoxWidth * 0.4;

        const marginTop = (height - binSize * 10) / 2 - 30;

        const pad = 0;

        dialoguePlot
          .selectAll("rect")
          .attr("x", () => {
            const center = leftMargin + (width - leftMargin) / 2;
            const gap = scriptBoxWidth * 0.2;
            if (idx === 0) return center - scriptBoxWidth - gap;
            if (idx === 1) return center + gap;
          })
          .attr("y", (d, i) => i * chunkHeight)
          .attr("width", 0)
          .attr("height", chunkHeight)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.2)
          .attr("fill-opacity", 0)
          .attr("fill", colorGenderMap.female)
          .transition()
          .duration(600)
          .attr("width", scriptBoxWidth + pad * 2)
          .transition()
          .duration(600)
          .attr("fill-opacity", (d) => d.femalePercentage.toFixed(2))
          .transition()
          .duration(600)
          .delay((d, i) => {
            return 5 * i;
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
          })
          .on("end", () => {
            dialoguePlot
              .selectAll("text")
              .attr("x", (d, i) => {
                const col = Math.floor(i % numPerRow);
                return leftMargin + col * (binSize + binPad) + boxPosX;
              })
              .attr("y", (d, i) => {
                const row = Math.floor(i / numPerRow);
                return marginTop + row * (binSize + binPad);
              })
              .attr("dy", -10)
              .transition()
              .duration(200)
              .attr("opacity", 1);
          });
      });
    };

    const showSentimentChart = () => {
      //from whereever show sentiment
      resetDialoguePlot({ onlyDiv: true });
      resetMarks();
      resetGenreMarks();
      resetAxis();
      resetStackedArea();
      // resetSentimentChart();
      hideLegend();

      dialoguePlotGroup
        .selectAll("rect")
        .transition()
        .duration(400)
        .delay((d, i) => {
          return 2 * i;
        })
        .attr("width", 0)
        .attr("height", 0)
        .on("end", () => {
          containerDiv
            .select(".sentiment-sample")
            .style("visibility", "visible")
            .transition()
            .duration(300)
            .style("opacity", 1);

          dialoguePlotGroup.selectAll("text").attr("opacity", 0);
        });
    };

    const hideEverything = () => {
      resetDialoguePlot();
      resetMarks();
      resetGenreMarks();
      resetAxis();
      resetStackedArea();
      resetSentimentChart();
      hideLegend();
    };

    functionMap.current = {
      "0": showTitle,
      "1": showTimeline,
      "2": showTimelineBechdelColor,
      "3": showBechdelTimelineArea,
      "4": showBeeswarmChart(genreDecadeBeeswarmData),
      "5": showDirectorBeeswarm(genreDirectorGrossBeeswarmData),
      // script alanysis
      "6": showSelectMovie,
      "7": showFemaleDialog,
      "8": showSegmentDiagram,
      "9": showSentimentChart,
      "10": hideEverything,
      updateBeeswarm,
    };
    // functionMap.current[activeStep]();
  }, [width, height, data]);

  useEffect(() => {
    setTimeout(() => {
      functionMap.current?.[0]?.();
    }, 0);
  }, []);

  useEffect(() => {
    // console.log("activeStep", activeStep, prevStep.current);

    const isBackward = prevStep.current > activeStep;
    functionMap.current?.[activeStep]?.({ isBackward });

    prevStep.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    functionMap.current?.["updateBeeswarm"]?.(sizeFactor);
  }, [sizeFactor]);

  useEffect(() => {
    const containerDiv = d3.select(containerRef.current);
    if (dashboardActive.isIntersecting) {
      containerDiv.style("visibility", "hidden");
    } else {
      containerDiv.style("visibility", "visible");
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
        <TooltipContent data={tooltipData} />
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
      <div className="sample-posters">
        {dialogueSampleData.map((d) => (
          <div
            key={d.id + "sample"}
            className={classNames("sample-poster")}
            style={{
              backgroundImage: `url("./posters/${d.data.rank}_${d.data.id}.jpg")`,
            }}
          ></div>
        ))}
      </div>
      <div className="story-legend">
        <div className="size-legend">
          <div className="key">{sizeFactor === "none" ? "" : sizeFactor}</div>
          <div className="val">
            {sizeExtentMap[sizeFactor]?.map((d, i) => (
              <div key={d} className="legend-item">
                <div
                  className={classNames("chip", { big: i === 1 })}
                  data-id={d}
                ></div>
                <span>{d.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bechdel-legend">
          <div className="key">Bechdel Score</div>
          <div className="val">
            {bechdelDomain.map((d) => (
              <div key={d} className="legend-item">
                <div className="chip" data-id={d}></div>
                <span>{d === "NA" ? "Unknown" : d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sentiment-sample">
        {dialogueSampleData.map((d, i) => (
          <div
            className={classNames("sentiment-sample-box", `movie-${i}`)}
            key={d.id}
          >
            <div className="title">{d.title}</div>
            <SentimentVis
              item={d}
              activeGender={null}
              chartHeight={height * 0.2}
              tooltipActive={false}
            ></SentimentVis>
          </div>
        ))}
        <div className="legend">
          <div
            className={classNames("legend-item female")}
            data-gender="female"
          >
            Female
            <div className="chip"></div>
          </div>
          <div className={classNames("legend-item male")} data-gender="male">
            Male
          </div>
          <div className={classNames("legend-item na")} data-gender="na">
            Unknown
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plot;

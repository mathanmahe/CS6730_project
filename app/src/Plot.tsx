import { useEffect, useState } from "react";
import * as d3 from "d3";
import { useResponsiveChart } from "./hooks/useResponsiveChart";
import { parseDialogue, splitArray, getFemalePercentage } from "./utils/script";
import "./Plot.scss";
import classNames from "classnames";
import { DialogueDataset, ChunkedDialogueDataset } from "./types";

const tempData = Array(100)
  .fill(0)
  .map((d, i) => ({
    id: i,
    value: i,
    bechdel: Math.floor(Math.random() * 4),
    year: Math.floor(Math.random() * 30) + 1990,
  }));

const Plot = ({ activeStep }: { activeStep: number }) => {
  // TODO use real data
  const data = tempData;

  //TODO use preprocessed data
  const [isLoading, setIsLoading] = useState(true);
  const [dialogueDataset, setDialogueDataset] = useState<DialogueDataset>([]);
  const [chunkedDataset, setChunkedDataset] = useState<ChunkedDialogueDataset>(
    []
  );

  const chunkSize = 100;
  useEffect(() => {
    const getLines = async () => {
      const titles = [
        "10-Things-I-Hate-About-You_dialogue",
        "12-and-Holding_dialogue",
      ];

      Promise.all(
        titles.map((title) => {
          return fetch(`./dialogue/${title}.txt`).then((d) => d.text());
        })
      ).then((arr) => {
        // get dialogue data
        const data = arr.map((d, i) => ({
          title: titles[i],
          data: parseDialogue(d),
        }));
        setDialogueDataset(data);

        // get chunked data
        const chunked = data.map(({ title, data }) => {
          const chunk = splitArray(data, chunkSize);
          return {
            title,
            data: chunk.map((d, i) => ({
              chunkIndex: i,
              data: d,
              femalePercentage: getFemalePercentage(d),
            })),
          };
        });
        setChunkedDataset(chunked);
        setIsLoading(false);
      });
    };
    getLines();
  }, []);
  /***********/

  const { width, height, svgRef, getContainerSize } = useResponsiveChart();

  const [functionMap, setFunctionMap] = useState<Record<string, () => void>>(
    {}
  );

  useEffect(() => {
    if (!width || !height) return;

    // Selection
    const svg = d3.select(svgRef.current);
    const dialogueDiv = d3.select(".dialogue-container");

    // Scatter plot axis
    const plotHeight = Math.min(300, height);
    const scatterYRange = [
      height / 2 + plotHeight / 2,
      height / 2 - plotHeight / 2,
    ];

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.bechdel) as [number, number])
      .range(scatterYRange)
      .nice();

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, width]);

    const yAxis = d3.axisLeft(y).tickFormat((d) => `${d}`);
    const yAxisGroup = svg.select("g.y-axis").call(yAxis);

    const xAxis = d3.axisBottom(x);
    const xAxisGroup = svg
      .select("g.x-axis")
      .style("transform", `translateY(${scatterYRange[0]}px)`)
      .call(xAxis);

    xAxisGroup.attr("opacity", 0);
    yAxisGroup.attr("opacity", 0);

    // Scatter plot marks
    const marksGroup = svg.select("g.marks");
    marksGroup
      .selectAll("rect.mark")
      .data(data)
      .join("rect")
      .attr("class", "mark")
      .attr("class", (d, i) => {
        //TODO use movie id
        if (i === 0) return "mark compare movie1";
        else if (i === 1) return "mark compare movie2";
        else return "mark";
      })
      .style("fill", "#ff8018")
      .attr("opacity", 0);

    // 2 movies comparison bins
    const dialoguePlotGroup = svg.select("g.dialogue-plots-group");

    dialoguePlotGroup
      .selectAll("g.dialogue-plot")
      .data(chunkedDataset)
      .join("g")
      .attr("class", (d, i) => `dialogue-plot movie-${i}`)
      .selectAll("rect.bin")
      .data((d) => d.data)
      .join("rect")
      .attr("class", "bin");
    /** */

    const resetDialoguePlot = () => {
      dialoguePlotGroup
        .selectAll("rect")
        .transition()
        .duration(200)
        .attr("width", 0)
        .attr("height", 0.5)
        .attr("stroke", "none");
    };

    // Step0: title
    const showTitle = () => {
      xAxisGroup.transition().duration(200).attr("opacity", 0);
      yAxisGroup.transition().duration(200).attr("opacity", 0);

      const squareSizeW = 100;
      const squareSizeH = 140;
      const squarePad = 5;
      const numPerRow = Math.floor(width / (squareSizeW + squarePad));

      svg
        .selectAll(".mark")
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 5 * i;
        })
        .attr("width", squareSizeW)
        .attr("height", squareSizeH)
        .attr("x", (d, i) => {
          const col = Math.floor(i % numPerRow);
          return col * (squareSizeW + squarePad);
        })
        .attr("y", (d, i) => {
          const col = Math.floor(i % numPerRow);
          const row = Math.floor(i / numPerRow);
          return row * (squareSizeH + squarePad);
          // + (col % 2 > 0 ? 70 : 0);
        })
        .attr("opacity", 1);
    };

    // Step1: Scatter plot
    const showStep1 = () => {
      xAxisGroup.transition().duration(1600).attr("opacity", 1);
      yAxisGroup.transition().duration(1600).attr("opacity", 1);

      svg
        .selectAll(".mark")
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 5 * i;
        })
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", (d) => x(d.year) - 6)
        .attr("y", (d) => y(d.bechdel) - 6)
        .attr("opacity", 1);
    };

    // Step2: Select 2 movies.
    const showStep2 = () => {
      dialogueDiv.transition().duration(600).style("opacity", 0);

      xAxisGroup.transition().duration(600).attr("opacity", 0);
      yAxisGroup.transition().duration(600).attr("opacity", 0);

      svg
        .selectAll(".mark")
        .transition()
        .duration(600)
        .delay((d, i) => {
          return 5 * i;
        })
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", (d) => x(d.year) - 6)
        .attr("y", (d) => y(d.bechdel) - 6)
        .attr("opacity", (d, i) => {
          //TODO use movie id
          if (i === 0 || i === 1) return 1;
          else return 0;
        });
    };

    const scriptBoxWidth = 200;
    const scriptBoxGap = 200;

    // Step2: Explain dialog analysis.
    const showStep3 = () => {
      resetDialoguePlot();
      dialogueDiv
        .style("color", "#fff")
        .selectAll("p")
        .style("background-color", "transparent");

      dialogueDiv.style("gap", scriptBoxGap + "px");
      dialogueDiv
        .selectAll(`.dialogue`)
        .style("width", scriptBoxWidth + "px")
        .style("font-size", 13 + "px");

      svg
        .selectAll(".mark.compare")
        .transition()
        .duration(400)
        .attr("x", (d, i) => i * scriptBoxWidth + i * scriptBoxGap)
        .attr("y", 0)
        .attr("width", scriptBoxWidth)
        .transition()
        .duration(500)
        .attr(
          "height",
          (d, i) =>
            dialogueDiv.select(`.dialogue.movie-${i}`)?.node()?.clientHeight
        )
        .attr("opacity", 1)
        .on("end", () => {
          dialogueDiv.transition().duration(400).style("opacity", 1);
        })
        .transition()
        .duration(400)
        .attr("opacity", 0)
        .on("end", () => {
          dialogueDiv
            .selectAll("p.female")
            .transition()
            .duration(1000)
            .delay(100)
            .style("background", "#ff8018");
        });
    };

    const showStep4 = () => {
      dialogueDiv.transition().duration(200).style("opacity", 1);
      svg.selectAll(".mark.compare").attr("opacity", 0);
      resetDialoguePlot();

      dialogueDiv
        .selectAll(`.dialogue`)
        .transition()
        .duration(1000)
        .style("font-size", 2.5 + "px")
        .on("end", (_, idx, nodes) => {
          dialogueDiv.transition().duration(1000).style("color", "transparent");
          const boxHeight = nodes[idx]?.clientHeight;
          const chunkHeight = boxHeight / chunkSize;
          const dialoguePlot = dialoguePlotGroup.select(
            `g.dialogue-plot.movie-${idx}`
          );
          const pad = 10;
          dialoguePlot
            .selectAll("rect")
            .attr("x", idx * scriptBoxWidth + idx * scriptBoxGap - pad)
            .attr("y", (d, i) => i * chunkHeight)
            .attr("width", 0)
            .attr("height", chunkHeight)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.2)
            .attr("fill-opacity", 0)
            .attr("fill", "#ff8018")
            .transition()
            .duration(1000)
            .delay(500)
            .attr("width", scriptBoxWidth + pad * 2);
        });
    };

    const showStep5 = () => {
      dialogueDiv.transition().duration(1000).style("opacity", 0);
      const plots = dialoguePlotGroup.selectAll(".dialogue-plot").nodes();

      const binSize = 30;
      const binPad = 0;
      const numPerRow = Math.sqrt(chunkSize);

      plots.forEach((plot, i) => {
        const boxPosX = i * scriptBoxWidth + i * scriptBoxGap;
        d3.select(plot)
          .selectAll("rect")
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
            return col * (binSize + binPad) + boxPosX;
          })
          .attr("y", (d, i) => {
            const row = Math.floor(i / numPerRow);
            return row * (binSize + binPad);
          });
      });
    };

    setFunctionMap({
      0: showTitle,
      1: showStep1,
      2: showStep2,
      3: showStep3,
      4: showStep4,
      5: showStep5,
    });
  }, [width, height, data]);

  useEffect(() => {
    console.log("activeStep", activeStep);
    functionMap?.[activeStep]?.();
  }, [activeStep, functionMap]);

  return isLoading ? null : (
    <div
      className="chart"
      style={{
        width: "100%",
        height: "100%",
        padding: "60px",
      }}
    >
      <svg
        ref={(r) => {
          svgRef.current = r;
          getContainerSize();
        }}
      >
        <g className="axis y-axis"></g>
        <g className="axis x-axis"></g>
        <g className="marks"></g>
        <g className="dialogue-plots-group"></g>
      </svg>
      <div className="tooltip"></div>
      <div className="dialogue-container">
        {dialogueDataset.map(({ title, data }, i) => (
          <div className={classNames("dialogue", `movie-${i}`)} key={i}>
            {data.map((d) => (
              <p
                key={d.id}
                className={classNames({
                  female: d.gender === "F",
                })}
              >
                {d.line + " "}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plot;

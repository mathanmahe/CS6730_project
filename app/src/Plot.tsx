import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useResponsiveChart } from "./hooks/useResponsiveChart";

const tempData = Array(100)
  .fill(0)
  .map((d, i) => ({
    id: i,
    value: i,
    bechdel: Math.floor(Math.random() * 4),
    year: Math.floor(Math.random() * 30) + 1990,
  }));

const tempDialogData = Array(100)
  .fill(0)
  .map((d, i) => ({
    id: i,
    value: i,
    bechdel: Math.floor(Math.random() * 4),
    year: Math.floor(Math.random() * 30) + 1990,
  }));

const Plot = ({ activeStep }: { activeStep: number }) => {
  const data = tempData;
  const { width, height, svgRef } = useResponsiveChart();

  const functionMap = useRef<Record<string, () => void>>({});

  useEffect(() => {
    if (!width || !height) return;
    const svg = d3.select(svgRef.current);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.bechdel) as [number, number])
      .range([height, 0])
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
      .style("transform", `translateY(${height}px)`)
      .call(xAxis);

    xAxisGroup.attr("opacity", 0);
    yAxisGroup.attr("opacity", 0);

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
      .style("fill", "#69b3a2")
      .attr("opacity", 0);

    const showTitle = () => {
      xAxisGroup.transition().duration(200).attr("opacity", 0);
      yAxisGroup.transition().duration(200).attr("opacity", 0);

      // Title
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

    const showStep2 = () => {
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

    const showStep3 = () => {
      const width = 200;
      const gap = 100;
      svg
        .selectAll(".mark.compare")
        .transition()
        .duration(600)
        .attr("width", width)
        .attr("height", width)
        .attr("x", (d, i) => i * width + i * gap)
        .attr("y", 0);
    };

    functionMap.current = {
      0: showTitle,
      1: showStep1,
      2: showStep2,
      3: showStep3,
    };
  }, [width, height, data]);

  useEffect(() => {
    functionMap.current?.[activeStep]?.();
  }, [activeStep]);

  return (
    <div
      className="chart"
      style={{
        width: "100%",
        height: "500px",
        padding: "60px",
      }}
    >
      <svg ref={svgRef}>
        <g className="y-axis"></g>
        <g className="x-axis"></g>
        <g className="marks"></g>
      </svg>
      <div className="tooltip"></div>
    </div>
  );
};

export default Plot;

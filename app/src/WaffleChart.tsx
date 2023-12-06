import React, { useEffect, useRef } from "react";
import { useResponsiveChart } from "./hooks/useResponsiveChart";
import { getFemalePercentage, splitArray } from "./utils/script";
import * as d3 from "d3";
import { colorGenderMap } from "./utils/data";

export const WaffleChart = ({
  data,
  title,
  isActive,
  index,
  chunkSize,
  binSize,
  transition = true,
}) => {
  const { width, height, svgRef, getContainerSize } = useResponsiveChart();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!width || !height || !data) return;
    console.log("waffle", isActive);
    isInitialized.current = false;

    const chunk = splitArray(data, chunkSize);
    const chunked = chunk.map((d, i) => ({
      chunkIndex: i,
      data: d,
      femalePercentage: getFemalePercentage(d),
    }));

    const binPad = 0;
    const numPerRow = Math.sqrt(chunkSize);
    const boxPosX = 0;

    const svg = d3
      .select(svgRef.current)
      .attr("width", numPerRow * binSize)
      .attr("height", numPerRow * binSize);
    const dialoguePlotGroup = svg.select("g.dialogue-plot");

    const bins = dialoguePlotGroup
      .selectAll("rect.bin")
      .data(chunked)
      .join("rect")
      .attr("class", "bin")
      .attr("x", (d, i) => {
        const col = Math.floor(i % numPerRow);
        return col * (binSize + binPad) + boxPosX;
      })
      .attr("y", (d, i) => {
        const row = Math.floor(i / numPerRow);
        return row * (binSize + binPad);
      })
      .attr("width", 0)
      .attr("height", 0)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.2)
      .attr("fill", colorGenderMap.female)
      .attr("fill-opacity", (d) => d.femalePercentage.toFixed(2));

    if (!transition) {
      bins.attr("width", binSize).attr("height", binSize);
    }
  }, [width, height, data, chunkSize, binSize, transition]);

  useEffect(() => {
    if (!width || !height || !data || !transition) return;

    if (!isInitialized.current) {
      const svg = d3.select(svgRef.current);
      const dialoguePlotGroup = svg.select("g.dialogue-plot");

      setTimeout(() => {
        dialoguePlotGroup
          .selectAll("rect.bin")
          .transition()
          .duration(500)
          .attr("width", binSize)
          .attr("height", binSize)
          .on("end", (d) => {
            if (d.chunkIndex === chunkSize - 1) isInitialized.current = true;
          });
      }, index * 100);
    }
  }, [isActive, transition]);

  return (
    <div className="waffle-chart">
      <svg
        ref={(r) => {
          svgRef.current = r;
          getContainerSize();
        }}
      >
        <g className="dialogue-plot"></g>
      </svg>
    </div>
  );
};

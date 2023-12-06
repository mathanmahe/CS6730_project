import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useResponsiveChart } from "./hooks/useResponsiveChart";

const colorMap = {
  female: "#e35e6d",
  male: "#27a7c1",
  na: "#444",
};
const emotionDomain = ["love", "joy", "surprise", "fear", "anger", "sadness"];
export const SentimentVis = ({ item, activeGender }) => {
  const {
    id,
    title,
    lines,
    data,
    totalWordCount,
    genderWordCount,
    genderWordPercent,
  } = item;
  const { width, height, svgRef, getContainerSize } = useResponsiveChart();
  const tooltipRef = useRef();

  const chartHeight = 250;
  const leftMargin = 50;

  useEffect(() => {
    if (!width || !height || !item) return;
    const svg = d3.select(svgRef.current).attr("height", chartHeight);
    const tooltip = d3.select(tooltipRef.current);
    const yScale = d3.scaleBand().domain(emotionDomain).range([0, chartHeight]);

    const xScale = d3
      .scaleLinear()
      .domain([0, totalWordCount])
      .range([0, width - leftMargin]);

    // const xAxis = d3.axisBottom(xScale);
    // const xAxisGroup = svg
    //   .select("g.x-axis")
    //   .style("transform", `translateY(${chartHeight}px)`)
    //   .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    const yAxisGroup = svg
      .select("g.y-axis")
      .style("transform", `translateX(${leftMargin}px)`)
      .call(yAxis);

    d3.select(containerRef.current).on("mouseleave", (e, d) => {
      tooltip.style("visibility", "hidden");
    });

    svg
      .select("g.bars")
      .selectAll("rect.bar")
      .data(item.lines)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.wordCountCursor) + leftMargin)
      .attr("y", (d) => yScale(d.emotion))
      .attr("width", (d) => {
        return xScale(d.wordCount);
      })
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorMap[d.gender.toLowerCase()])
      .on("mouseover", (e, d) => {
        tooltip
          .style("visibility", "visible")
          .style("top", e.clientY - 200 + "px")
          .style("left", e.clientX + "px")
          .text(`${d.imdbCharacter}: "${d.line}"`);
      });

    const guidePath = [
      [leftMargin, yScale(emotionDomain[3])],
      [width, yScale(emotionDomain[3])],
    ];

    svg
      .select("path.guide")
      .attr(
        "d",
        d3.line(
          (d) => d[0],
          (d) => d[1]
        )(guidePath)
      )
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4")
      .attr("stroke", "darkgrey");

    svg
      .selectAll("text.guide-text")
      .attr("x", width)
      .attr("y", yScale(emotionDomain[3]))
      .attr("fill", "white")
      .attr("text-anchor", "end");

    svg
      .select("path.x-path")
      .attr(
        "d",
        d3.line(
          (d) => d[0],
          (d) => d[1]
        )([
          [leftMargin, chartHeight],
          [width, chartHeight],
        ])
      )
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "darkgrey");

    svg
      .selectAll("text.x-label.start")
      .attr("x", leftMargin)
      .attr("y", chartHeight)
      .attr("fill", "white")
      .attr("text-anchor", "start");
    svg
      .selectAll("text.x-label.end")
      .attr("x", width)
      .attr("y", chartHeight)
      .attr("fill", "white")
      .attr("text-anchor", "end");

    svg.selectAll("g.y-axis g.tick line").attr("opacity", 0);
  }, [width, height, item]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("rect.bar").attr("opacity", (d) => {
      return !activeGender
        ? 1
        : d.gender.toLowerCase() === activeGender
        ? 1
        : 0.1;
    });
  }, [activeGender]);

  const containerRef = useRef();
  return (
    <div ref={containerRef}>
      <svg
        ref={(r) => {
          svgRef.current = r;
          getContainerSize();
        }}
      >
        <g className="bars" />
        <g className="x-axis">
          <path className="x-path"></path>
          <text className="x-label start" dy="18">
            Movie start
          </text>
          <text className="x-label end" dy="18">
            Movie end
          </text>
        </g>
        <g className="y-axis"></g>
        <path className="guide"></path>
        <text className="guide-text positive" dy="-12">
          Positive
        </text>
        <text className="guide-text negative" dy="18">
          Negative
        </text>
      </svg>
      <div className="sentiment-tooltip" ref={tooltipRef}></div>
    </div>
  );
};

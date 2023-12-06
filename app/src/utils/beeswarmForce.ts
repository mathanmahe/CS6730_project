import * as d3 from "d3";
import { sizeExtentMap } from "./data";

export const beeswarmForce = function () {
  let x = (d) => d[0];
  let y = (d) => d[1];
  let r = (d) => d[2];
  let xStrength = 0.1;
  let yStrength = 0.1;

  let ticks = 300;

  function beeswarm(data) {
    const entries = data.map((d) => {
      return {
        x0: typeof x === "function" ? x(d) : x,
        y0: typeof y === "function" ? y(d) : y,
        r: typeof r === "function" ? r(d) : r,
        data: d,
      };
    });

    const simulation = d3
      .forceSimulation(entries)
      .force("x", d3.forceX((d) => d.x0).strength(xStrength))
      .force("y", d3.forceY((d) => d.y0).strength(yStrength))
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.r)
      );

    for (let i = 0; i < ticks; i++) simulation.tick();

    return entries;
  }

  beeswarm.x = (f) => (f ? ((x = f), beeswarm) : x);
  beeswarm.y = (f) => (f ? ((y = f), beeswarm) : y);
  beeswarm.yStrength = (v) => (v ? ((yStrength = v), beeswarm) : yStrength);
  beeswarm.xStrength = (v) => (v ? ((xStrength = v), beeswarm) : xStrength);
  beeswarm.r = (f) => (f ? ((r = f), beeswarm) : r);
  beeswarm.ticks = (n) => (n ? ((ticks = n), beeswarm) : ticks);

  return beeswarm;
};

export const getBeeswarmData = ({
  data,
  x,
  y,
  sizeAttribute,
  xStrength = 0.1,
  yStrength = 0.1,
  sizeRange,
}) => {
  const sizeScale = d3
    .scaleLinear()
    .domain(sizeExtentMap[sizeAttribute] || [])
    .range(sizeRange);

  const beeswarm = beeswarmForce()
    .x(x)
    .y(y)
    .r((d) =>
      typeof sizeAttribute === "number"
        ? sizeAttribute
        : sizeScale(d[sizeAttribute])
    )
    .xStrength(xStrength)
    .yStrength(yStrength);

  const beeswarmData = beeswarm(data);
  return beeswarmData;
};

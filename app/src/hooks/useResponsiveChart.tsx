import { useEffect, useRef, useState } from "react";

export const useResponsiveChart = () => {
  const svgRef = useRef(null);

  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  const getContainerSize = () => {
    if (!svgRef.current) return;

    const newWidth = svgRef.current.clientWidth;
    setWidth(newWidth);

    const newHeight = svgRef.current.clientHeight;
    setHeight(newHeight);
  };

  useEffect(() => {
    getContainerSize();
    window.addEventListener("resize", getContainerSize);

    return () => window.removeEventListener("resize", getContainerSize);
  }, []);

  return {
    width,
    height,
    svgRef,
  };
};

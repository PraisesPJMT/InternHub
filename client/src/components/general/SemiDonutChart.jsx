import { useEffect, useState, useRef } from "react";

import { Card } from "@/components/ui/card";

const SemiDonutChart = ({
  value = 0,
  isLoading,
  isError,
  strokeWidth = 50,
  color = "#5c60f8",
  duration = 1000,
  className = "",
}) => {
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState(200);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Handle dynamic sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setSize(Math.min(containerWidth, 400)); // Max size of 400px
      }
    };

    handleResize(); // Initial size calculation
    window.addEventListener("resize", handleResize);

    // Use ResizeObserver for more precise container size tracking
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Handle progress animation
  useEffect(() => {
    if (!isLoading && !isError) {
      const timeout = setTimeout(() => setProgress(value), 100);
      return () => clearTimeout(timeout);
    }
  }, [value, isLoading, isError]);

  const radius = Math.max((size - strokeWidth) / 2, 0);
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  const arcPath = `
    M ${strokeWidth / 2} ${size / 2}
    A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
  `;

  // Handle mouse events for tooltip
  const handleMouseEnter = (event) => {
    if (!isLoading && !isError) {
      setShowTooltip(true);
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMouseMove = (event) => {
    if (showTooltip) {
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Determine colors based on status
  const getColors = () => {
    const value = isLoading
      ? { foreground: "#9CA3AF", background: "#E5E7EB" }
      : isError
        ? { foreground: "#FCA5A5", background: "#FEE2E2" }
        : { foreground: color, background: "#E5E7EB" };
    return value;
  };

  const colors = getColors();

  // Loading animation keyframes
  const loadingAnimation = isLoading
    ? {
        animation:
          "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite animate-pulse",
      }
    : {};

  return (
    <Card className="@container/card">
      <div
        ref={containerRef}
        className={`relative flex items-center justify-center w-full ${className}`}
        style={{
          height: size / 2,
          transition: "height 300ms ease-out",
        }}
      >
        <svg
          width={size}
          height={size / 2}
          style={{ transition: "all 300ms ease-out" }}
        >
          {/* Background arc */}
          <path
            d={arcPath}
            fill="transparent"
            stroke={colors.background}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Foreground arc */}
          <path
            d={arcPath}
            fill="transparent"
            stroke={colors.foreground}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isLoading ? circumference * 0.25 : offset}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: isLoading
                ? "none"
                : `stroke-dashoffset ${duration}ms ease-out, stroke 300ms ease-out`,
              ...loadingAnimation,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={!isLoading && !isError ? "cursor-pointer" : ""}
          />
        </svg>

        {/* Value display */}
        {!isLoading && !isError && value !== undefined && (
          <div
            className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-[30%] font-semibold text-[#111827] flex items-center justify-center text-center transition-opacity duration-300"
            style={{
              fontSize: `${Math.max(size * 0.12, 12)}px`,
              opacity: progress > 0 ? 1 : 0,
            }}
          >
            {Math.round(progress)}%
          </div>
        )}

        {/* Loading text */}
        {isLoading && (
          <div
            className="h-[40%] w-[40%] bg-gray-300 rounded animate-pulse absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-[30%] font-semibold text-[#6B7280] flex items-center justify-center text-center"
            style={{ fontSize: `${Math.max(size * 0.06, 12)}px` }}
          ></div>
        )}

        {/* Error text */}
        {isError && (
          <div
            className="h-[40%] w-[40%] bg-[#FCA5A5] rounded absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-[30%] font-semibold text-[#DC2626] flex items-center justify-center text-center"
            style={{ fontSize: `${Math.max(size * 0.06, 12)}px` }}
          ></div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 px-2 py-.5 text-sm text-white bg-[#045DA0] rounded-2xl shadow-lg pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 30}px`,
            transform: "translateX(-50%)",
          }}
        >
          {value}%
        </div>
      )}
    </Card>
  );
};

export default SemiDonutChart;

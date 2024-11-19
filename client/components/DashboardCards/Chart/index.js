import { useEffect, useRef } from "react";
import * as echarts from "echarts";

function Chart({ options, title = "", className = "" }) {
  const chartRef = useRef(null);
  let chartInstance = null;

  function renderChart() {
    try {
      const renderedInstance = echarts.getInstanceByDom(chartRef.current);
      if (renderedInstance) {
        chartInstance = renderedInstance;
      } else {
        chartInstance = echarts.init(chartRef.current);
      }
      chartInstance.setOption(options);
    } catch (error) {
      console.error("error", error.message);
      chartInstance && chartInstance.dispose();
    }
  }

  function resizeHandler() {
    chartInstance.resize();
  }

  useEffect(() => {
    renderChart();
    return () => {
      chartInstance && chartInstance.dispose();
    };
  }, [options]);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className={`card shadow-sm mt-4 ${className}`}>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <div 
          style={{ 
            height: "250px",
            width: "100%",
            position: "relative"
          }} 
          ref={chartRef} 
        />
      </div>
    </div>
  );
}

export default Chart;
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

function Chart({ options }) {
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
  }, [options]); // 監聽 options 變化

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h2 className="card-title">每日營業額</h2>
        <div style={{ height: "400px" }} ref={chartRef} />
      </div>
    </div>
  );
}

export default Chart;
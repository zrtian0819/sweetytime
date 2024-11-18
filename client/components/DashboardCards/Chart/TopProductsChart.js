import { useEffect, useRef } from "react";
import * as echarts from "echarts";

function TopProductsChart({ data }) {
  const chartRef = useRef(null);
  let chartInstance = null;

  const getOptions = (data) => ({
    title: {
      text: '熱門商品銷售比例',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} 件 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      type: 'scroll'
    },
    series: [
      {
        name: '商品銷量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c} 件'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: data.map(item => ({
          name: item.name,
          value: item.amount
        }))
      }
    ]
  });

  function renderChart() {
    try {
      const renderedInstance = echarts.getInstanceByDom(chartRef.current);
      if (renderedInstance) {
        chartInstance = renderedInstance;
      } else {
        chartInstance = echarts.init(chartRef.current);
      }
      chartInstance.setOption(getOptions(data));
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
  }, [data]);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h2 className="card-title">熱門商品銷量</h2>
        <div style={{ height: "400px" }} ref={chartRef} />
      </div>
    </div>
  );
}

export default TopProductsChart;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';
import DashboardCards from '@/components/DashboardCards';
import Chart from "@/components/DashboardCards/Chart/index.js";
import TopProductsChart from "@/components/DashboardCards/Chart/TopProductsChart";

const Index = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [revenueResponse, topProductsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/revenue`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/top10-products`)
        ]);
        
        setRevenueData(revenueResponse.data);
        setTopProductsData(topProductsResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('無法載入數據');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

// 營業額
  const revenueOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br />營業額: {c} 元'
    },
    legend: {
      data: ["每日營業額"],
    },
    xAxis: {
      type: 'category',
      data: revenueData.map(item => item.order_date),
      // axisLabel: {
      //   rotate:  // 讓x軸標籤斜放以避免擠在一起
      // }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    series: [
      {
        name: "營業額",
        type: "line",
        data: revenueData.map(item => item.revenue),
        smooth: true, 
        itemStyle: {
          color: '#fe6f67' 
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#fe6f6730'
            }, {
              offset: 1,
              color: 'rgba(254, 111, 103, 0.1)'
            }]
          }
        }
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    }
  };

// 熱門商品銷售比例  
  const topProductsOptions = {
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
          borderWidth: 2,
          color: function(params) {
            const colors = ['#fe6f67', '#fdb461', '#63d0e4', '#5fb7ec', '#c5a4ff',
                          '#ff9f7f', '#fb7293', '#e7bcf3', '#8378ea', '#96dee8'];
            return colors[params.dataIndex % colors.length];
          }
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
        data: topProductsData.map(item => ({
          name: item.name,
          value: item.amount
        }))
      }
    ]
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">載入中...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-5 text-danger">{error}</div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <h2>Hello Team Sweety Time : D</h2>
      <div className="d-flex flex-wrap">
        <DashboardCards />
      </div>
      <Chart options={revenueOptions} />
      <Chart options={topProductsOptions} />
    </AdminLayout>
  );
};

export default Index;
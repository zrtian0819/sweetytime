import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';
import DashboardCards from '@/components/DashboardCards';
import Chart from "@/components/DashboardCards/Chart/index.js";

const Index = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/revenue`
        );
        setRevenueData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('無法載入營業額數據');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const options = {
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
      <Chart options={options} />
    </AdminLayout>
  );
};

export default Index;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';
import DashboardCards from '@/components/DashboardCards';
import Chart from '@/components/DashboardCards/Chart/index.js';

const Index = () => {
	const [revenueData, setRevenueData] = useState([]);
	const [topProductsData, setTopProductsData] = useState([]);
	const [topShopsData, setTopShopsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [revenueResponse, topProductsResponse, topShopsResponse] = await Promise.all([
					axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/revenue`),
					axios.get(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/top5-products`
					),
					axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/top5-shops`),
				]);

				setRevenueData(revenueResponse.data);
				setTopProductsData(topProductsResponse.data);
				setTopShopsData(topShopsResponse.data);
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
			formatter: '{b}<br />營業額: {c} 元',
		},
		legend: {
			data: ['每日營業額'],
		},
		xAxis: {
			type: 'category',
			data: revenueData.map((item) => item.order_date),
			// axisLabel: {
			//   rotate:  // 讓x軸標籤斜放以避免擠在一起
			// }
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value} 元',
			},
		},
		series: [
			{
				name: '營業額',
				type: 'line',
				data: revenueData.map((item) => item.revenue),
				smooth: true,
				itemStyle: {
					color: '#fe6f67',
				},
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: '#fe6f6730',
							},
							{
								offset: 1,
								color: 'rgba(254, 111, 103, 0.1)',
							},
						],
					},
				},
			},
		],
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			top: '10%',
			containLabel: true,
		},
	};

	// 30天內熱門商品top5
	const topProductsOptions = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
			formatter: '{b}: {c} 件',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			type: 'scroll',
		},
		grid: {
			left: '15%',
			right: '4%',
			bottom: '3%',
			top: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'value',
			name: '銷售數量 (件)',
		},
		yAxis: {
			type: 'category',
			data: topProductsData.map((item) => item.name),
			axisLabel: {
				interval: 0,
				width: 100,
				overflow: 'truncate',
			},
		},
		series: [
			{
				name: '商品銷量',
				type: 'bar',
				data: topProductsData
					.sort((a, b) => a.amount - b.amount)
					.map((item) => item.amount),
				itemStyle: {
					color: '#FF7DA1',
					borderRadius: [0, 5, 5, 0],
				},
				label: {
					show: true,
					position: 'right',
					formatter: '{c} 件',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '16',
						fontWeight: 'bold',
					},
				},
			},
		],
	};

	// 30天內熱門店家top5
	const topShopsOptions = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
			formatter: '{b}: {c} 件',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			type: 'scroll',
		},
		grid: {
			left: '15%',
			right: '4%',
			bottom: '3%',
			top: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'value',
			name: '銷售數量 (件)',
		},
		yAxis: {
			type: 'category',
			data: topShopsData.map((item) => item.name),
			axisLabel: {
				interval: 0,
				width: 100,
				overflow: 'truncate',
			},
		},
		series: [
			{
				name: '店家銷量',
				type: 'bar',
				data: topShopsData.sort((a, b) => a.price - b.price).map((item) => item.price),
				itemStyle: {
					color: '#FF7DA1',
					borderRadius: [0, 5, 5, 0],
				},
				label: {
					show: true,
					position: 'right',
					formatter: '{c} 件',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '16',
						fontWeight: 'bold',
					},
				},
			},
		],
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
			<div
				style={{
					maxHeight: '100%',
					overflowY: 'auto',
					scrollbarWidth: '15px',
				}}
			>
				<h2>Hello Team Sweety Time : D</h2>
				{/* <div className="d-flex flex-wrap"> */}
				<DashboardCards />
				{/* </div> */}
				<div className="d-flex">
					<Chart options={revenueOptions} title="每日營業額" className="w-100" />
				</div>
				<div className="d-flex">
					<Chart options={topProductsOptions} title="30天內熱銷商品" className="w-50" />
					<Chart options={topShopsOptions} title="30天內熱銷店家" className="w-50" />
				</div>
			</div>
		</AdminLayout>
	);
};

export default Index;

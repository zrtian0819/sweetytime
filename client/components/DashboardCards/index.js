import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardCards = () => {
	const [usersData, setUsersData] = useState({
		NumUser: 0,
		NumShop: 0,
		NumAdmin: 0,
	});
	const [blacklistData, setBlacklistData] = useState({
		NumBlacklist: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [usersResponse, blacklistResponse] = await Promise.all([
					axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/users`),
					axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/blacklist`),
				]);

				setUsersData(usersResponse.data[0]);
				setBlacklistData(blacklistResponse.data[0]);
				setError(null);
			} catch (err) {
				console.error('Error fetching dashboard data:', err);
				setError('無法載入數據');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <div className="text-center py-5">載入中...</div>;
	}

	if (error) {
		return <div className="text-center py-5 text-danger">{error}</div>;
	}

	const cardStyle = {
		minHeight: '160px', // 設定固定最小高度
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	};

	const titleStyle = {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		fontSize: '1.1rem',
		marginBottom: '0.75rem',
	};

	const numberStyle = {
		fontSize: '2rem',
		fontWeight: 'bold',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	};

	const subtitleStyle = {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		fontSize: '0.875rem',
	};

	return (
		<div className="row g-4">
			<div className="col-md-6 col-lg-3">
				<div className="card shadow-sm" style={cardStyle}>
					<div className="card-body d-flex flex-column">
						<h5 className="card-title" style={titleStyle}>
							會員人數
						</h5>
						<div className="mt-auto">
							<div style={numberStyle}>{usersData.NumUser}</div>
							<p className="card-text text-muted mb-0" style={subtitleStyle}>
								活躍用戶總數
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="col-md-6 col-lg-3">
				<div className="card shadow-sm" style={cardStyle}>
					<div className="card-body d-flex flex-column">
						<h5 className="card-title" style={titleStyle}>
							商家數量
						</h5>
						<div className="mt-auto">
							<div style={numberStyle}>{usersData.NumShop}</div>
							<p className="card-text text-muted mb-0" style={subtitleStyle}>
								註冊商家總數
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="col-md-6 col-lg-3">
				<div className="card shadow-sm" style={cardStyle}>
					<div className="card-body d-flex flex-column">
						<h5 className="card-title" style={titleStyle}>
							黑名單用戶
						</h5>
						<div className="mt-auto">
							<div style={numberStyle}>{blacklistData.NumBlacklist}</div>
							<p className="card-text text-muted mb-0" style={subtitleStyle}>
								已停用帳戶數量
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="col-md-6 col-lg-3">
				<div className="card shadow-sm" style={cardStyle}>
					<div className="card-body d-flex flex-column">
						<h5 className="card-title" style={titleStyle}>
							管理員
						</h5>
						<div className="mt-auto">
							<div style={numberStyle}>{usersData.NumAdmin}</div>
							<p className="card-text text-muted mb-0" style={subtitleStyle}>
								系統管理員數量
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardCards;

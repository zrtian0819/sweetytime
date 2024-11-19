import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import CouponItem from '@/components/coupon/CouponItem';
import Pagination from '@/components/pagination';
import CouponDetailModal from '@/components/CouponDetailModal';

import { FaFilter } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

import Styles from '@/styles/user.module.scss';
import styles from '@/components/shop/banner.module.scss';

import axios from 'axios';
import { useUser } from '@/context/userContext';
import { withAuth } from '@/components/auth/withAuth';

function UserVoucherWallet() {
	// 初始狀態設置
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [activeTab, setActiveTab] = useState('ALL');
	const [sortOrder, setSortOrder] = useState('asc');
	const [searchTerm, setSearchTerm] = useState('');
	const [activeSearchTerm, setActiveSearchTerm] = useState('');
	const [showSortMobile, setShowSortMobile] = useState(false);
	const [coupon, setCoupon] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useUser();

	// 設定每頁顯示數量
	const ITEMS_PER_PAGE = 6;

	// 獲取優惠券數據
	useEffect(() => {
		if (user?.id) {
			setIsLoading(true);
			axios
				.get(`http://localhost:3005/api/coupon/my-coupons`)
				.then((response) => {
					const processedCoupons = response.data.map((coupon) => ({
						...coupon,
						status: new Date(coupon.end_date) > new Date() ? 'AVAILABLE' : 'EXPIRED',
					}));
					setCoupon(processedCoupons);
				})
				.catch((error) => {
					console.error('Error fetching user coupons:', error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [user?.id]);

	// 點擊外部關閉手機版排序選單
	useEffect(() => {
		const handleClickOutside = (event) => {
			const sortMenu = document.getElementById('mobile-sort-menu');
			if (showSortMobile && sortMenu && !sortMenu.contains(event.target)) {
				setShowSortMobile(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showSortMobile]);

	// 處理排序
	const handleSort = (order) => {
		setSortOrder(order);
		setShowSortMobile(false);
	};

	// 處理搜尋輸入
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	  };

	// 處理搜尋
	const handleSearchSubmit = (event) => {
		if (event) {
			event.preventDefault();
		}
		setActiveSearchTerm(searchTerm);
		setCurrentPage(1);
	};

	// 處理按下 Enter 鍵
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleSearchSubmit(event);
		}
	};

	// 處理篩選點擊
	const handleFilterClick = () => {
		setShowSortMobile(!showSortMobile);
	};

	// 優惠券過濾和排序
	const filterAndSortCoupons = (coupons, filter, searchTerm, sortOrder) => {
		let filtered = coupons;

		if (filter !== 'ALL') {
			filtered = coupons.filter((coupon) => coupon.status === filter);
		}

		if (activeSearchTerm) {
			const searchTermLower = activeSearchTerm.toLowerCase();
			filtered = filtered.filter((coupon) => {
				return (
					(coupon.name && coupon.name.toLowerCase().includes(searchTermLower)) ||
					(coupon.discount_rate &&
						coupon.discount_rate.toString().includes(searchTermLower))
				);
			});
		}

		return filtered.sort((a, b) => {
			const dateA = new Date(a.end_date);
			const dateB = new Date(b.end_date);
			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		});
	};

	// 獲取過濾後的優惠券
	const filteredCoupons = filterAndSortCoupons(coupon, activeTab, searchTerm, sortOrder);
	const currentCoupons = filteredCoupons.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	// 處理優惠券點擊
	const handleCouponClick = (coupon) => {
		setSelectedCoupon(coupon);
		setShowModal(true);
	};

	// 處理分頁標籤點擊
	const handleTabClick = (e, tab) => {
		e.preventDefault();
		setActiveTab(tab);
		setCurrentPage(1);
	};

	// 處理分頁
	const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			const pageDiff = Math.abs(currentPage - newPage);
			setCurrentPage(newPage);

			if (pageDiff === 1) {
				const couponContainer = document.querySelector(`.${Styles['coupon']}`);
				if (couponContainer) {
					couponContainer.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}
	};

	// 獲取優惠券數量統計
	const couponCounts = {
		all: coupon.length,
		available: coupon.filter((c) => c.status === 'AVAILABLE').length,
		expired: coupon.filter((c) => c.status === 'EXPIRED').length,
	};

	return (
		<>
			<Header />
			<UserBox>
				<h2 className={`${Styles['WGS-pColor']}`}>會員優惠券</h2>
				<div className={`container overflow-y-auto`}>
					{/* 搜尋和排序區域 */}
					<div className="d-flex justify-content-between align-items-center mb-3 gap-2">
						<div className="position-relative flex-grow-1">
							<input
								className={`w-100 ${Styles['WGS-coupon-search']}`}
								type="text"
								placeholder="輸入優惠券名稱或折扣率搜尋"
								value={searchTerm}
								onChange={handleSearchInput}
								onKeyPress={handleKeyPress}
							/>
							<button
								className={`position-absolute top-50 translate-middle-y me-2 ${styles['TIL-search-icon']}`}
								style={{
									border: 'none',
									background: 'none',
									right: 0,
									cursor: 'pointer',
								}}
								onClick={handleSearchSubmit}
							>
								<FaSearch
									size={16}
									style={{
										color: '#fe6f67',
										opacity: 0.8,
									}}
								/>
							</button>
						</div>

						{/* 電腦版排序選單 */}
						<select
							className={`${styles['TIL-form-select']} d-none d-sm-block`}
							value={sortOrder}
							onChange={(e) => handleSort(e.target.value)}
						>
							<option value="asc">使用期限：近～遠</option>
							<option value="desc">使用期限：遠～近</option>
						</select>

						{/* 手機版篩選按鈕 */}
						<button
							className={`${styles['TIL-filter-btn']} d-block d-sm-none`}
							onClick={handleFilterClick}
							style={{ border: 'none', background: 'none', color: '#fe6f67' }}
						>
							<FaFilter size={25} />
						</button>
					</div>

					{/* 手機版排序選單 */}
					{showSortMobile && (
						<div
							id="mobile-sort-menu"
							className="position-fixed top-0 start-0 w-100 h-100 bg-white"
							style={{ zIndex: 1050, padding: '20px' }}
						>
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h5 className="mb-0">排序方式</h5>
								<button
									onClick={() => setShowSortMobile(false)}
									className="btn btn-link text-dark p-0"
								>
									<FaTimes size={24} />
								</button>
							</div>
							<div className="d-flex flex-column gap-3">
								<button
									className={`btn ${
										sortOrder === 'asc' ? 'btn-primary' : 'btn-outline-primary'
									}`}
									onClick={() => handleSort('asc')}
								>
									使用期限：近～遠
								</button>
								<button
									className={`btn ${
										sortOrder === 'desc' ? 'btn-primary' : 'btn-outline-primary'
									}`}
									onClick={() => handleSort('desc')}
								>
									使用期限：遠～近
								</button>
							</div>
						</div>
					)}

					{/* 標籤分頁 */}
					<ul className={`${Styles['nav']} ${Styles['nav-pills']} mb-4 px-1`}>
						<li className={`${Styles['nav-item']}`}>
							<a
								className={`${Styles['nav-link']} ${
									activeTab === 'ALL' ? Styles['active'] : ''
								}`}
								onClick={(e) => handleTabClick(e, 'ALL')}
								role="button"
							>
								全部({couponCounts.all})
							</a>
						</li>
						<li className={`${Styles['nav-item']}`}>
							<a
								className={`${Styles['nav-link']} ${
									activeTab === 'AVAILABLE' ? Styles['active'] : ''
								}`}
								onClick={(e) => handleTabClick(e, 'AVAILABLE')}
								role="button"
							>
								可使用({couponCounts.available})
							</a>
						</li>
						<li className={`${Styles['nav-item']}`}>
							<a
								className={`${Styles['nav-link']} ${
									activeTab === 'EXPIRED' ? Styles['active'] : ''
								}`}
								onClick={(e) => handleTabClick(e, 'EXPIRED')}
								role="button"
							>
								已失效({couponCounts.expired})
							</a>
						</li>
					</ul>

					{/* 優惠券列表 */}
					<div className="container pe-0">
						<div className={`${Styles['coupon']} row g-3`}>
							{isLoading ? (
								<div className="col-12 text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">載入中...</span>
									</div>
								</div>
							) : currentCoupons.length === 0 ? (
								<div className="col-12 text-center py-5">
									<p>沒有符合條件的優惠券</p>
								</div>
							) : (
								currentCoupons.map((coupon, index) => (
									<div
										key={`${coupon.id}-${index}`}
										className="col-lg-6 col-md-12 d-flex justify-content-center"
										onClick={() => handleCouponClick(coupon)}
										style={{ cursor: 'pointer' }}
									>
										<CouponItem
											discount_rate={coupon.discount_rate}
											name={coupon.name}
											end_date={coupon.end_date}
											status={coupon.status}
										/>
									</div>
								))
							)}
						</div>
					</div>

					{/* 優惠券詳情彈窗 */}
					<CouponDetailModal
						coupon={selectedCoupon}
						isOpen={showModal}
						onClose={() => setShowModal(false)}
					/>
				</div>

				{/* 分頁器 */}
				{totalPages > 1 && (
					<div className="m-auto py-4">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							changeColor="#fe6f67"
						/>
					</div>
				)}
			</UserBox>
			<Footer />
		</>
	);
}

export default withAuth(UserVoucherWallet);

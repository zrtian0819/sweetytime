import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import CouponItem from '@/components/coupon/CouponItem';
import Pagination from '@/components/pagination';
import CouponDetailModal from '@/components/CouponDetailModal';

import { FaFilter } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';

import Styles from '@/styles/user.module.scss';
import styles from '@/components/shop/banner.module.scss';

import axios from 'axios';
import { useUser } from '@/context/userContext';
import { withAuth } from '@/components/auth/withAuth'; //引入登入檢查

function UserVoucherWallet() {
	// 初始狀態設置
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [activeTab, setActiveTab] = useState('ALL');
	const [sortOrder, setSortOrder] = useState('asc');
	const [searchTerm, setSearchTerm] = useState('');
	const [showSortMobile, setShowSortMobile] = useState(false);
	const [coupon, setCoupon] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useUser(); // 使用 userContext 獲取用戶信息

	// 設定每頁顯示數量
	const ITEMS_PER_PAGE = 6;

	useEffect(() => {
		// 確保有用戶ID才發送請求
		if (user?.id) {
			setIsLoading(true);
			// 使用新的API端點獲取特定用戶的優惠券
			axios
				.get(`http://localhost:3005/api/coupon/my-coupons`)
				.then((response) => {
					// 處理響應數據，添加狀態標記
					const processedCoupons = response.data.map((coupon) => ({
						...coupon,
						status: new Date(coupon.end_date) > new Date() ? 'AVAILABLE' : 'EXPIRED',
					}));
					setCoupon(processedCoupons);
				})
				.catch((error) => {
					console.error('Error fetching user coupons:', error);
					// 可以添加錯誤處理，比如顯示錯誤消息
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [user?.id]); // 依賴於用戶ID

	// 處理日期排序
	const handleSort = (order) => {
		console.log('Sorting order changed to:', order);
		setSortOrder(order);
		setShowSortMobile(false); // 關閉手機版排序選單
	};

	// 處理搜尋
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1);
	};

	// 處理搜尋按鈕點擊
	const handleSearchClick = () => {
		// 觸發搜尋邏輯，這裡可以重新設置currentPage確保從第一頁開始顯示結果
		setCurrentPage(1);
		// 如果需要，可以在這裡添加其他搜尋相關的邏輯
	};

	// 處理手機版篩選按鈕點擊
	const handleFilterClick = () => {
		setShowSortMobile(!showSortMobile);
	};

	// 過濾和排序優惠券
	const filterAndSortcoupon = (coupon, filter, searchTerm, sortOrder) => {
		// 先進行狀態過濾
		let filtered = coupon;
		if (filter !== 'ALL') {
			filtered = coupon.filter((coupon) => coupon.status === filter);
		}

		// 搜尋過濾
		if (searchTerm) {
			filtered = filtered.filter((coupon) => {
				const searchTermLower = searchTerm.toLowerCase();

				const nameMatch = coupon.name
					? coupon.name.toLowerCase().includes(searchTermLower)
					: false;

				const discountRateMatch = coupon.discount_rate
					? coupon.discount_rate.toString().includes(searchTermLower)
					: false;

				return nameMatch || discountRateMatch;
			});
		}

		// 日期排序
		return filtered.sort((a, b) => {
			// 確保使用正確的日期欄位名稱
			const dateA = new Date(a.end_date);
			const dateB = new Date(b.end_date);
			return sortOrder === 'asc'
				? dateA - dateB // 近到遠
				: dateB - dateA; // 遠到近
		});
	};

	// 獲取過濾後的優惠券
	const filteredcoupon = filterAndSortcoupon(coupon, activeTab, searchTerm, sortOrder);

	// 獲取當前頁面的優惠券
	const currentcoupon = filteredcoupon.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handleCouponClick = (coupon) => {
		setSelectedCoupon(coupon);
		setShowModal(true);
	};

	const handleTabClick = (e, tab) => {
		e.preventDefault();
		setActiveTab(tab);
		setCurrentPage(1);
	};

	const totalPages = Math.ceil(filteredcoupon.length / ITEMS_PER_PAGE);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			// 計算頁碼差異
			const pageDiff = Math.abs(currentPage - newPage);

			setCurrentPage(newPage);

			// 只有在使用上一頁/下一頁按鈕時（差異為1）才捲動
			if (pageDiff === 1) {
				// 找到優惠券列表的容器元素
				const couponContainer = document.querySelector(`.${Styles['coupon']}`);
				if (couponContainer) {
					couponContainer.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}
	};

	const getCouponCounts = (coupon) => {
		return {
			all: coupon.length,
			available: coupon.filter((coupon) => coupon.status === 'AVAILABLE').length,
			expired: coupon.filter((coupon) => coupon.status === 'EXPIRED').length,
		};
	};

	const couponCounts = getCouponCounts(coupon);

	return (
		<>
			<Header />
			<div className={`${Styles['TIL-body']} container`}>
				<div className={`${Styles['TIL-userbody']} d-flex flex-column flex-md-row`}>
					<UserBox>
						<div className={`container  overflow-y-auto`}>
							<div className="d-flex justify-content-between align-items-center mb-3 gap-3">
								<input
									className={`w-100 ${Styles['WGS-coupon-search']}`}
									type="text"
									placeholder="輸入優惠券名稱或折扣率搜尋"
									value={searchTerm}
									onChange={handleSearch}
								/>
								<select
									className={`${styles['TIL-form-select']} d-none d-sm-block`}
									aria-label="Default select example"
									value={sortOrder}
									onChange={(e) => handleSort(e.target.value)}
								>
									<option value="asc">使用期限:近~遠</option>
									<option value="desc">使用期限:遠~近</option>
								</select>
								<button className={`${styles['TIL-search']} d-block d-sm-none`}>
									<FaFilter size={25} className={styles['TIL-FaFilter']} />
								</button>
								<button className={styles['TIL-search']}>
									<FaSearch size={25} className={styles['TIL-FaSearch']} />
								</button>
							</div>
							{/* 標籤分頁 */}
							<ul className={`${Styles['nav']} ${Styles['nav-pills']} mb-4`}>
								<li className={`${Styles['nav-item']}`}>
									<a
										className={`${Styles['nav-link']} ${
											activeTab === 'ALL' ? Styles['active'] : ''
										}`}
										onClick={(e) => handleTabClick(e, 'ALL')}
										role="button"
										style={{ cursor: 'pointer' }}
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
										style={{ cursor: 'pointer' }}
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
										style={{ cursor: 'pointer' }}
									>
										已失效({couponCounts.expired})
									</a>
								</li>
							</ul>
							{/* 優惠券列表部分 */}
							<div className="container">
								<div className={`${Styles['coupon']} row g-3`}>
									{currentcoupon.map((coupon, index) => (
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
									))}
								</div>
							</div>

							{/* 彈出的優惠券詳情視窗 */}
							<CouponDetailModal
								coupon={selectedCoupon}
								isOpen={showModal}
								onClose={() => setShowModal(false)}
							/>
						</div>
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
				</div>
			</div>
			<Footer />
		</>
	);
}
export default withAuth(UserVoucherWallet);

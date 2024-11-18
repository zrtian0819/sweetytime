import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Styles from '@/styles/shopBackstage/order.module.scss';
import axios from 'axios';
import { useUser } from '@/context/userContext';
import Window from '@/components/shopBackstage/orders/window';
import { FaSearch } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

const deliveryMap = {
	1: '7-11',
	2: '宅配',
};

export default function Order() {
	const ITEMS_PER_PAGE = 10;
	const { user } = useUser(); // 從 context 獲取當前用戶資訊
	const [shopOrder, setShopOrder] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);

	const [currentPage, setCurrentPage] = useState(1); // 分頁
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState('');
	const [money, setMoney] = useState('');
	const [payment, setPayment] = useState('');
	const [delivery, setDelivery] = useState('');
	const [total, setTotal] = useState('');
	const hasFilters = keyword || status || payment || delivery || total || money;

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				if (user?.role === 'shop') {
					// 根據商家 ID 請求資料

					const response = await axios.get(
						`http://localhost:3005/api/shopBackstage-order/orders/${user.id}`
					);
					setShopOrder(response.data.orders);
					setFilteredOrders(response.data.orders);
				}
			} catch (error) {
				console.error('Error fetching orders:', error);
			}
		};
		fetchOrders();
	}, [user]);

	// 搜尋篩選
	const applyFilters = () => {
		let filteredOrders = [...shopOrder];

		if (keyword) {
			filteredOrders = filteredOrders.filter(
				(order) =>
					(order.id && order.id.toString().includes(keyword)) ||
					(order.delivery_name &&
						order.delivery_name.toLowerCase().includes(keyword.toLowerCase()))
			);
		}

		if (status) {
			filteredOrders = filteredOrders.filter((order) => order.status === status);
		}
		if (payment) {
			filteredOrders = filteredOrders.filter(
				(order) =>
					order.payment && order.payment.toLowerCase().includes(payment.toLowerCase())
			);
		}
		if (delivery) {
			filteredOrders = filteredOrders.filter(
				(order) => order.delivery === parseInt(delivery)
			);
		}
		if (total) {
			filteredOrders = filteredOrders.filter((orders) => {
				const orderTotal = orders.total_price;
				switch (total) {
					case '500 元以下':
						return orderTotal < 500;
					case '500 ~ 1500':
						return orderTotal >= 500 && orderTotal <= 1500;
					case '1501 ~ 2500':
						return orderTotal > 1500 && orderTotal <= 2500;
					case '2500 元以上':
						return orderTotal > 2500;
					default:
						return true;
				}
			});
		}
		if (money) {
			filteredOrders.sort((a, b) => {
				if (money === '1') {
					return b.total_price - a.total_price; // 大 ~ 小
				} else if (money === '2') {
					return a.total_price - b.total_price; // 小 ~ 大
				}
				return 0;
			});
		}
		setFilteredOrders(filteredOrders);
		setCurrentPage(1);
	};

	// 清除搜尋內容
	const onRecover = () => {
		setKeyword('');
		setStatus('');
		setMoney('');
		setPayment('');
		setDelivery('');
		setTotal('');
		setFilteredOrders(shopOrder);
		setCurrentPage(1);
	};

	//排序
	const handleSort = (type) => {
		const orderSort = [...filteredOrders].sort((a, b) => {
			if (type === 'asc') {
				return a.orderNumber - b.orderNumber;
			} else {
				return b.orderNumber - a.orderNumber;
			}
		});
		setFilteredOrders(orderSort);
	};

	return (
		<AdminLayout
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={(page) => setCurrentPage(page)}
		>
			<div className={Styles['TIL-ShopPage']}>
				<div className="d-flex flex-row justify-content-between my-3 gap-5 ">
					<div className="w-100 h-100 filter-box d-flex justify-content-start gap-2 mb-4">
						<div className={`${Styles['TIL-keyWord']} position-relative `}>
							<input
								value={keyword}
								type="text"
								className={`${Styles['CTH-keywords']}`}
								placeholder="透過會員姓名、訂單編號搜尋"
								onChange={(e) => setKeyword(e.target.value)}
							/>
							{hasFilters && (
								<button
									className="btn position-absolute border-0"
									style={{ top: '0', right: '0', color: 'gray' }}
									onClick={onRecover}
								>
									<TiDelete size={25} />
								</button>
							)}
						</div>
						<FormControl sx={{ width: '200px', height: '100%' }}>
							<InputLabel
								id="status-select-label"
								sx={{
									color: '#fe6f67',
									'&.Mui-focused': {
										color: '#fe6f67',
									},
								}}
								shrink={true}
							>
								狀態
							</InputLabel>
							<Select
								label="狀態"
								id="status-select"
								value={status || ''}
								onChange={(e) => setStatus(e.target.value)}
								displayEmpty
								MenuProps={{
									disableScrollLock: true,
								}}
								sx={{
									backgroundColor: '#ffffff',
									height: '40px',
									color: '#fe6f67',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
								}}
							>
								<MenuItem value="" sx={{ color: '#fe6f67' }}>
									不限
								</MenuItem>
								<MenuItem value="進行中" sx={{ color: '#fe6f67' }}>
									進行中
								</MenuItem>
								<MenuItem value="運送中" sx={{ color: '#fe6f67' }}>
									運送中
								</MenuItem>
								<MenuItem value="已完成" sx={{ color: '#fe6f67' }}>
									已完成
								</MenuItem>
							</Select>
						</FormControl>

						<FormControl sx={{ width: '200px', height: '100%' }}>
							<InputLabel
								id="payment-select-label"
								sx={{
									color: '#fe6f67',
									'&.Mui-focused': {
										color: '#fe6f67',
									},
								}}
								shrink={true}
							>
								付款方式
							</InputLabel>
							<Select
								label="付款方式"
								id="payment-select"
								value={payment || ''}
								onChange={(e) => setPayment(e.target.value)}
								displayEmpty
								MenuProps={{
									disableScrollLock: true,
								}}
								sx={{
									backgroundColor: '#ffffff',
									height: '40px',
									color: '#fe6f67',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
								}}
							>
								<MenuItem value="" sx={{ color: '#fe6f67' }}>
									不限
								</MenuItem>
								<MenuItem value="cash" sx={{ color: '#fe6f67' }}>
									cash
								</MenuItem>
								<MenuItem value="LinePay" sx={{ color: '#fe6f67' }}>
									LinePay
								</MenuItem>
								<MenuItem value="綠界" sx={{ color: '#fe6f67' }}>
									綠界
								</MenuItem>
							</Select>
						</FormControl>

						<FormControl sx={{ width: '200px', height: '100%' }}>
							<InputLabel
								id="delivery-select-label"
								sx={{
									color: '#fe6f67',
									'&.Mui-focused': {
										color: '#fe6f67',
									},
								}}
								shrink={true}
							>
								寄送方式
							</InputLabel>
							<Select
								label="寄送方式"
								id="delivery-select"
								value={delivery || ''}
								onChange={(e) => setDelivery(e.target.value)}
								displayEmpty
								MenuProps={{
									disableScrollLock: true,
								}}
								sx={{
									backgroundColor: '#ffffff',
									height: '40px',
									color: '#fe6f67',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
								}}
							>
								<MenuItem value="" sx={{ color: '#fe6f67' }}>
									不限
								</MenuItem>
								<MenuItem value="1" sx={{ color: '#fe6f67' }}>
									7-11
								</MenuItem>
								<MenuItem value="2" sx={{ color: '#fe6f67' }}>
									宅配
								</MenuItem>
							</Select>
						</FormControl>

						<FormControl sx={{ width: '200px', height: '100%' }}>
							<InputLabel
								id="total-select-label"
								sx={{
									color: '#fe6f67',
									'&.Mui-focused': {
										color: '#fe6f67',
									},
								}}
								shrink={true}
							>
								金額範圍
							</InputLabel>
							<Select
								label="金額範圍"
								id="total-select"
								value={total || ''}
								onChange={(e) => setTotal(e.target.value)}
								displayEmpty
								MenuProps={{
									disableScrollLock: true,
								}}
								sx={{
									backgroundColor: '#ffffff',
									height: '40px',
									color: '#fe6f67',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
								}}
							>
								<MenuItem value="" sx={{ color: '#fe6f67' }}>
									不限
								</MenuItem>
								<MenuItem value="500 元以下" sx={{ color: '#fe6f67' }}>
									500 元以下
								</MenuItem>
								<MenuItem value="500 ~ 1500" sx={{ color: '#fe6f67' }}>
									500 ~ 1500
								</MenuItem>
								<MenuItem value="1501 ~ 2500" sx={{ color: '#fe6f67' }}>
									1501 ~ 2500
								</MenuItem>
								<MenuItem value="2500 元以上" sx={{ color: '#fe6f67' }}>
									2500 元以上
								</MenuItem>
							</Select>
						</FormControl>

						<FormControl sx={{ width: '200px', height: '100%' }}>
							<InputLabel
								id="money-sort-select-label"
								sx={{
									color: '#fe6f67',
									'&.Mui-focused': {
										color: '#fe6f67',
									},
								}}
								shrink={true}
							>
								金額排序
							</InputLabel>
							<Select
								label="金額排序"
								id="money-sort-select"
								value={money || ''}
								onChange={(e) => setMoney(e.target.value)}
								displayEmpty
								MenuProps={{
									disableScrollLock: true,
								}}
								sx={{
									backgroundColor: '#ffffff',
									height: '40px',
									color: '#fe6f67',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67',
									},
								}}
							>
								<MenuItem value="" sx={{ color: '#fe6f67' }}>
									不限
								</MenuItem>
								<MenuItem value="1" sx={{ color: '#fe6f67' }}>
									大 ~ 小
								</MenuItem>
								<MenuItem value="2" sx={{ color: '#fe6f67' }}>
									小 ~ 大
								</MenuItem>
							</Select>
						</FormControl>

						<button className={Styles['TIL-search']} onClick={applyFilters}>
							<FaSearch size={25} className={Styles['TIL-FaSearch']} />
						</button>
					</div>
					<div className={Styles['TIL-Btns']}>
						<button
							className={`${Styles['TIL-btn']} btn`}
							onClick={() => handleSort('asc')}
						>
							排序A-Z
						</button>
						<button
							className={`${Styles['TIL-btn']} btn`}
							onClick={() => handleSort('desc')}
						>
							排序Z-A
						</button>
					</div>
				</div>

				<div className={Styles['table-container']}>
					<div className={Styles['table-header']}>
						<div className={Styles['table-cell']}>ID</div>
						<div className={Styles['table-cell']}>狀態</div>
						<div className={Styles['table-cell']}>訂單編號</div>
						<div className={Styles['table-cell']}>訂購人名稱</div>
						<div className={Styles['table-cell']}>付款方式</div>
						<div className={Styles['table-cell']}>寄送方式</div>
						<div className={Styles['table-cell']}>總金額</div>
						<div className={Styles['table-cell']}>進單時間</div>
						<div className={Styles['table-cell']}>訂單明細</div>
					</div>
					{currentOrders.map((order) => (
						<div className={Styles['table-row']} key={order.orderNumber}>
							<div className={Styles['table-cell']}>{order.orderNumber}</div>
							<div className={Styles['table-cell']}>{order.status}</div>
							<div className={Styles['table-cell']}>{order.id}</div>
							<div className={Styles['table-cell']}>{order.delivery_name}</div>
							<div className={Styles['table-cell']}>{order.payment}</div>
							<div className={Styles['table-cell']}>
								{deliveryMap[order.delivery]}
							</div>
							<div className={`${Styles['table-cell']}`}>{order.total_price}</div>
							<div className={Styles['table-cell']}>{order.order_time}</div>
							<div className={`${Styles['table-cell']}`}>
								<Window orderData={order} />
							</div>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
}

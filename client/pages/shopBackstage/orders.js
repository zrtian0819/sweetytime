import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Styles from '@/styles/shopBackstage/order.module.scss';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

const deliveryMap = {
	1: '7-11',
	2: '宅配',
};

export default function Order() {
	const ITEMS_PER_PAGE = 10;
	const [shopOrder, setShopOrder] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1); // 分頁
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState('');
	const [productClass, setProductClass] = useState('');
	const [payment, setPayment] = useState('');
	const [delivery, setDelivery] = useState('');
	const [total, setTotal] = useState('');

	useEffect(() => {
		axios
			.get('http://localhost:3005/api/shopBackstage-order')
			.then((response) => {
				const orderData = response.data;
				setShopOrder(orderData); // 儲存初始資料
				setFilteredOrders(orderData);
			})
			.catch((error) => console.error('Error fetching shops:', error));
	}, []);

	// 搜尋篩選
	const applyFilters = () => {
		let filteredOrders = [...shopOrder];

		if (keyword) {
			filteredOrders = filteredOrders.filter(
				(order) =>
					(order.number && order.number.toLowerCase().includes(keyword.toLowerCase())) ||
					(order.delivery_name &&
						order.delivery_name.toLowerCase().includes(keyword.toLowerCase()))
			);
		}

		if (status) {
			filteredOrders = filteredOrders.filter((order) => order.status === status);
		}
		if (productClass) {
			filteredOrders = filteredOrders.filter((order) => order.productClass === productClass);
		}
		if (payment) {
			filteredOrders = filteredOrders.filter((order) => order.payment === payment);
		}
		if (delivery) {
			filteredOrders = filteredOrders.filter((order) => order.delivery === delivery);
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
		setFilteredOrders(filteredOrders);
		setCurrentPage(1);
	};

	// 清除搜尋內容
	const onRecover = () => {
		setKeyword('');
		setStatus('');
		setProductClass('');
		setPayment('');
		setDelivery('');
		setTotal('');
		setFilteredOrders(shopOrder);
		setCurrentPage(1);
	};

	const handleSort = (type) => {
		const orderSort = [...filteredOrders].sort((a, b) => {
			if (type === 'asc') {
				return a.id - b.id;
			} else {
				return b.id - a.id;
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
				<div className={Styles['TIl-nav']}>
					<div className="d-flex flex-row justify-content-between my-3 gap-5 ">
						<div className="w-100 filter-box d-flex justify-content-start gap-2">
							<div className={`${Styles['TIL-keyWord']} position-relative `}>
								<input
									value={keyword}
									type="text"
									className={`${Styles['CTH-keywords']}`}
									placeholder="透過會員姓名、訂單編號搜尋"
									onChange={(e) => setKeyword(e.target.value)}
								/>
								{keyword && (
									<button
										className="btn position-absolute border-0"
										style={{ top: '5px', right: '0' }}
										onClick={onRecover}
									>
										<TiDelete size={25} />
									</button>
								)}
							</div>
							<select
								className={`${Styles['TIL-form-select']} `}
								value={status}
								onChange={(e) => setStatus(e.target.value)}
							>
								<option value="" disabled>
									狀態
								</option>
								<option>進行中</option>
								<option>運送中</option>
								<option>已完成</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => setProductClass(e.target.value)}
								value={productClass}
							>
								<option value="" disabled>
									商品類別
								</option>
								<option value="1">蛋糕</option>
								<option value="2">餅乾</option>
								<option value="3">塔/派</option>
								<option value="4">泡芙</option>
								<option value="5">冰淇淋</option>
								<option value="6">其他</option>
								<option value="7">可麗露</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => setPayment(e.target.value)}
								value={payment}
							>
								<option disabled value="">
									付款方式
								</option>
								<option>cash</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => setDelivery(e.target.value)}
								value={delivery}
							>
								<option disabled value="">
									寄送方式
								</option>
								<option value="1">711</option>
								<option value="2">宅配</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => setTotal(e.target.value)}
								value={total}
							>
								<option disabled value="">
									金額範圍
								</option>
								<option>500 元以下</option>
								<option>500 ~ 1500</option>
								<option>1501 ~ 2500</option>
								<option>2500 元以上</option>
							</select>
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
						<div className={Styles['table-cell']}>查看明細</div>
					</div>
					{currentOrders.map((order) => (
						<div className={Styles['table-row']} key={order.id}>
							<div className={Styles['table-cell']}>{order.id}</div>
							<div className={Styles['table-cell']}>{order.status}</div>
							<div className={Styles['table-cell']}>{order.number}</div>
							<div className={Styles['table-cell']}>{order.delivery_name}</div>
							<div className={Styles['table-cell']}>{order.payment}</div>
							<div className={Styles['table-cell']}>
								{deliveryMap[order.delivery]}
							</div>
							<div className={`${Styles['table-cell']}`}>{order.total_price}</div>
							<div className={Styles['table-cell']}>{order.order_time}</div>
							<div className={`${Styles['table-cell']}`}>查看</div>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
}

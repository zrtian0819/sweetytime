import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Styles from '@/styles/shopBackstage/order.module.scss';
import axios from 'axios';
import AdminSearch from '@/components/adminSearch';
import { FaSearch } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

export default function Order() {
	const ITEMS_PER_PAGE = 10;
	const [shopOrder, setShopOrder] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1); // 分頁

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

	// 處理搜尋欄位變化
	const handleKeywordChange = (newKeyword) => {
		setKeyword(newKeyword);
	};

	//清除按鈕的執行
	const onRecover = () => {
		setKeyword('');
		setSelectedStatus('all');
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

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentorders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

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
									placeholder="透過商品名稱、訂單編號搜尋"
								/>
								<button
									className="btn position-absolute border-0"
									style={{ top: '0', right: '0' }}
									onClick={onRecover}
								>
									<TiDelete size={25} />
								</button>
							</div>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => onRegionChange(e.target.value)}
							>
								<option selected disabled>
									狀態
								</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => onSortChange(e.target.value)}
							>
								<option selected disabled>
									商品類別
								</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => onSortChange(e.target.value)}
							>
								<option selected disabled>
									付款方式
								</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => onSortChange(e.target.value)}
							>
								<option selected disabled>
									寄送方式
								</option>
							</select>
							<select
								className={`${Styles['TIL-form-select']}`}
								onChange={(e) => onSortChange(e.target.value)}
							>
								<option selected disabled>
									金額範圍
								</option>
							</select>
							<button className={Styles['TIL-search']}>
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
					{currentorders.map((order) => (
						<div className={Styles['table-row']} key={order.id}>
							<div className={Styles['table-cell']}>{order.id}</div>
							<div className={Styles['table-cell']}>{order.status}</div>
							<div className={Styles['table-cell']}>{order.number}</div>
							<div className={Styles['table-cell']}>{order.delivery_name}</div>
							<div className={Styles['table-cell']}>{order.payment}</div>
							<div className={Styles['table-cell']}>{order.delivery}</div>
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

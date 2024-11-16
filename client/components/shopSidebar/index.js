import React, { useState, useEffect } from 'react';
import Styles from './shopSidebar.module.scss';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ShopSidebar({ styles, onShopClick, action }) {
	const [shops, setShops] = useState([]);
	const router = useRouter();

	useEffect(() => {
		axios
			.get('http://localhost:3005/api/shops-sidebar')
			.then((res) => setShops(res.data))
			.catch((err) => console.error(err));
	}, []);

	// Sidebar 顯示店家數量
	const [displayedShops, setDisplayedShops] = useState(10);
	const itemsPerPage = 5;
	const totalShops = shops.length;
	const remainingShops = totalShops - displayedShops;

	const onShopAdd = () => {
		setDisplayedShops((current) => Math.min(current + itemsPerPage, totalShops));
	};

	const onShopReduce = () => {
		setDisplayedShops((current) => Math.max(current - itemsPerPage, 0));
	};

	const handleToggleButton = () => {
		// if (remainingShops > 0) {
		// 	onShopAdd();
		// } else {
		// 	onShopReduce();
		// }
		onShopAdd();
		// 只保留更多店家的功能
	};

	// 點擊商家行為
	const handleShopClick = (id, name, logoName) => {
		if (action === 'navigate') {
			// 如果 action 是 "navigate"，跳轉到商家細節頁
			router.push(`/shop/${id}`);
		} else if (action === 'filter' && onShopClick) {
			// 如果 action 是 "filter"，調用傳入的篩選邏輯
			onShopClick(id, name, logoName);
		}
	};

	return (
		<>
			<div className={`${Styles['sidebar']} `} style={styles}>
				<div className={`${Styles['shopName']} py-3`}>
					<h3 className="ZRT-center mb-0" onClick={() => handleShopClick(null)}>
						所有店家
					</h3>
				</div>
				{shops.slice(0, displayedShops).map((s) => (
					<div key={s.id}>
						<div
							className={Styles['shopName']}
							onClick={() => handleShopClick(s.id, s.name, s.logo_path)} // 根據 action 處理點擊行為
						>
							{s.name}
						</div>
					</div>
				))}
				{remainingShops > 0 && (
					<div className={`${Styles['accordion']} `}>
						<div className={Styles['showMoreBtn']} onClick={onShopAdd}>
							<h4 className={Styles['accordion-header']}>更多店家</h4>
						</div>
						<div
							className="accordion-collapse collapse show"
							aria-labelledby="headingOne"
							data-bs-parent="#accordionExample"
						>
							<div className={`${Styles['remainText']}`}>
								還有 {remainingShops} 個店家
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

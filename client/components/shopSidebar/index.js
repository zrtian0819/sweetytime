import React, { useState, useEffect } from 'react';
import Styles from './shopSidebar.module.scss';
import Link from 'next/link';
import axios from 'axios';

export default function shopSidebar({ styles }) {
	const [shops, setShops] = useState([]);
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

	return (
		<>
			<div className={`${Styles['sidebar']} `} style={styles}>
				{shops.slice(0, displayedShops).map((s) => (
					<Link href={''} key={s.id}>
						<div className={Styles['shopName']}>{s.name}</div>
					</Link>
				))}
				{remainingShops > 0 && (
					<div className={`${Styles['accordion']} `}>
						<div className={Styles['showMoreBtn']} onClick={handleToggleButton}>
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

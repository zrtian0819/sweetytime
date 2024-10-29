import React, { useState, useEffect } from 'react';
import Styles from './shopSidebar.module.scss';
import Link from 'next/link';

export default function Index() {
	// 店家假資料
	const shops = [
		{ shop_id: 1, name: '花磚甜點', logo: 'sugar_logo.png' },
		{ shop_id: 2, name: '稍甜 SYRUP LESS', logo: 'SYRUP_LESS_logo.png' },
		{ shop_id: 3, name: '吃吃喝喝MAISONGOURMANDE', logo: 'Maison_Gourmande_logo.jpg' },
		{ shop_id: 4, name: '艾波索 法式甜點', logo: 'Aposo_logo.png' },
		{ shop_id: 5, name: 'iFcake 如菓蛋糕', logo: 'iFcake_logo.jpg' },
		{ shop_id: 6, name: 'la vie bonbon 中山旗艦店', logo: 'laviebonbon_logo.jpg' },
		{ shop_id: 7, name: '橘村屋', logo: 'kitsumuraya_logo.jpg' },
		{ shop_id: 8, name: '羊毛與花．光點', logo: 'youmoutoohana_Coffee.logo.jpg' },
		{ shop_id: 9, name: 'Lidée Sweet 時甜(敦化店)', logo: 'SEASON_Artisan_Pâtissier_logo.jpg' },
		{ shop_id: 10, name: '法點法食FADENFASAï', logo: 'FADENFASAï_logo.png' },
		{ shop_id: 11, name: '點冰室·ジャビン', logo: 'Give_Cold_Bird_logo.jpg' },
		{ shop_id: 12, name: '金雞母Jingimoo', logo: '法國主廚的甜點Nosif_logo.jpg' },
		{ shop_id: 13, name: '果昂甜品', logo: 'ami_logo.jpg' },
		{ shop_id: 14, name: '倉鼠甜點工作室', logo: 'chessmate_logo.jpg' },
		{ shop_id: 15, name: 'Miss V Bakery Cafe', logo: 'ladyM_logo.png' },
		{
			shop_id: 16,
			name: 'Monsieur Pierre皮耶先生•手作烘焙 晴光店',
			logo: 'Patisserie_Mon_Coeur_logo.jpg',
		},
		{ shop_id: 17, name: 'CrewsDessert空服員的手作甜點', logo: 'mpapa_logo.png' },
		{ shop_id: 18, name: '歐卡諾諾 `O ka roll roll', logo: 'TokyoParisDessert_logo.png' },
		{ shop_id: 19, name: 'bonniesugar手作甜點專門店', logo: 'mosaicPastry_logo.jpg' },
		{ shop_id: 20, name: 'Chizup!', logo: 'Jingimoo_logo.png' },
	];

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
	};

	return (
		<>
			<div className={`${Styles['sidebar']} `}>
				{shops.slice(0, displayedShops).map((s) => (
					<Link href={'/'} key={s.shop_id}>
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

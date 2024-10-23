import React, { useState } from 'react';
import Header from '@/components/header';
import styles from '@/styles/shop.module.scss';
import Shop from '@/components/shop';
import Nav from '@/components/shop/nav';
import Footer from '@/components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Index() {
	const shops = [
		{ id: 1, name: '花磚甜點', logo: 'sugar_logo.png' },
		{ id: 2, name: '稍甜 SYRUP LESS', logo: 'SYRUP_LESS_logo.png' },
		{ id: 3, name: '吃吃喝喝MAISONGOURMANDE', logo: 'Maison_Gourmande_logo.jpg' },
		{ id: 4, name: '艾波索 法式甜點', logo: 'Aposo_logo.png' },
		{ id: 5, name: 'iFcake 如菓蛋糕', logo: 'iFcake_logo.jpg' },
		{ id: 6, name: 'la vie bonbon 中山旗艦店', logo: 'laviebonbon_logo.jpg' },
		{ id: 7, name: '橘村屋', logo: 'kitsumuraya_logo.jpg' },
		{ id: 8, name: '羊毛與花．光點', logo: 'youmoutoohana_Coffee.logo.jpg' },
		{ id: 9, name: 'Lidée Sweet 時甜（敦化店', logo: 'SEASON_Artisan_Pâtissier_logo.jpg' },
		{ id: 10, name: '法點法食FADENFASAï', logo: 'FADENFASAï_logo.png' },
		{ id: 11, name: '點冰室·ジャビン', logo: 'sugar_logo.png' },
		{ id: 12, name: '金雞母Jingimoo', logo: 'sugar_logo.png' },
		{ id: 13, name: '果昂甜品', logo: 'sugar_logo.png' },
		{ id: 14, name: '倉鼠甜點工作室', logo: 'sugar_logo.png' },
		{ id: 15, name: 'Miss V Bakery Cafe', logo: 'sugar_logo.png' },
		{ id: 16, name: 'Monsieur Pierre皮耶先生•手作烘焙 晴光店', logo: 'sugar_logo.png' },
		{ id: 17, name: 'CrewsDessert空服員的手作甜點', logo: 'sugar_logo.png' },
		{ id: 18, name: '歐卡諾諾 `O ka roll roll', logo: 'sugar_logo.png' },
		{ id: 19, name: 'bonniesugar手作甜點專門店', logo: 'sugar_logo.png' },
		{ id: 20, name: 'Chizup!', logo: 'sugar_logo.png' },
		// { id: 21, name: 'Chizup!', logo: 'sugar_logo.png' },
		// { id: 22, name: 'Chizup!', logo: 'sugar_logo.png' },
		// { id: 23, name: 'Chizup!', logo: 'sugar_logo.png' },
	];

	//收藏
	const initState = shops.map((v) => ({ ...v, fav: false }));
	const [favoriteIcon, setFavoriteIcon] = useState(initState);

	const handleToggleFav = (id) => {
		const nextProduct = favoriteIcon.map((v) => (id === v.id ? { ...v, fav: !v.fav } : v));
		setFavoriteIcon(nextProduct);
	};

	//sidebar
	const [displayedShops, setDisplayedShops] = useState(10);
	const itemsPreShop = 5; // 每次增加顯示店家

	const totalShop = shops.length;
	const Remaining = totalShop - displayedShops;
	const onShopAdd = () => {
		setDisplayedShops((prev) => Math.min(prev + itemsPreShop, totalShop));
	};

	return (
		<>
			<Header />
			<div className={`${styles['TIL-body']} d-flex flex-column`}>
				<div className="TIL-nav"><Nav /></div>
				<div className={`${styles['TIL-content']} container`}>
					<div className={styles['TIL-sideBar']}>
						<div className={styles['TIL-List']}>
							{shops.slice(0, displayedShops).map((shop, index) => (
								<div key={index} className={styles['TIL-shop']}>
									{shop.name}
								</div>
							))}
							<div className={styles['accordion']} id="accordionExample">
								<h4 className={styles['accordion-header']} id="headingOne">
									<button
										className={styles['TIL-shopMore']}
										onClick={onShopAdd}
										type="button"
										data-bs-toggle="collapse"
										data-bs-target="#collapseOne"
										aria-expanded="true"
										aria-controls="collapseOne"
									>
										更多店家
									</button>
								</h4>
								<div
									id="collapseOne"
									className="accordion-collapse collapse show"
									aria-labelledby="headingOne"
									data-bs-parent="#accordionExample"
								>
									<div className={styles['TIL-accordion-body']}>
										還有 {Remaining} 個店家
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`${styles['TIL-shop-content']} d-flex flex-row px-5`}>
						{favoriteIcon.map((shop, index) => (
							<Shop
								key={index}
								shop={shop}
								onToggleFav={handleToggleFav}
								className={styles['TIL-Favorite']}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

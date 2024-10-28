import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import styles from '@/styles/shop.module.scss';
import Shop from '@/components/shop';
import Banner from '@/components/shop/banner';
import Footer from '@/components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Pagination from '@/components/pagination';

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
		{ id: 9, name: 'Lidée Sweet 時甜(敦化店)', logo: 'SEASON_Artisan_Pâtissier_logo.jpg' },
		{ id: 10, name: '法點法食FADENFASAï', logo: 'FADENFASAï_logo.png' },
		{ id: 11, name: '點冰室·ジャビン', logo: 'Give_Cold_Bird_logo.jpg' },
		{ id: 12, name: '金雞母Jingimoo', logo: '法國主廚的甜點Nosif_logo.jpg' },
		{ id: 13, name: '果昂甜品', logo: 'ami_logo.jpg' },
		{ id: 14, name: '倉鼠甜點工作室', logo: 'chessmate_logo.jpg' },
		{ id: 15, name: 'Miss V Bakery Cafe', logo: 'ladyM_logo.png' },
		{
			id: 16,
			name: 'Monsieur Pierre皮耶先生•手作烘焙 晴光店',
			logo: 'Patisserie_Mon_Coeur_logo.jpg',
		},
		{ id: 17, name: 'CrewsDessert空服員的手作甜點', logo: 'mpapa_logo.png' },
		{ id: 18, name: '歐卡諾諾 `O ka roll roll', logo: 'TokyoParisDessert_logo.png' },
		{ id: 19, name: 'bonniesugar手作甜點專門店', logo: 'mosaicPastry_logo.jpg' },
		{ id: 20, name: 'Chizup!', logo: 'Jingimoo_logo.png' },
		{ id: 21, name: 'Chizup!', logo: 'sugar_logo.png' },
		{ id: 22, name: 'Chizup!', logo: 'sugar_logo.png' },
		{ id: 23, name: 'Chizup!', logo: 'sugar_logo.png' },
	];

	// 收藏邏輯
	const initState = shops.map((v) => ({ ...v, fav: false }));
	const [favoriteIcon, setFavoriteIcon] = useState(initState);

	const handleToggleFav = (id) => {
		const nextProduct = favoriteIcon.map((v) => (id === v.id ? { ...v, fav: !v.fav } : v));
		setFavoriteIcon(nextProduct);
	};

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
		if (remainingShops > 0) {
			onShopAdd();
		} else {
			onShopReduce();
		}
	};

	return (
		<>
			<Header />
			<div className="TIL-banner">
				<Banner />
			</div>
			<div className={`${styles['TIL-body']} mt-5 d-flex flex-column container`}>
				<div className=" p-0 row mt-5">
					<div className={`${styles['TIL-sideBar']} col-3`}>
						<div className={`${styles['TIL-List']} d-flex flex-column p-2`}>
							{shops.slice(0, displayedShops).map((s) => (
								<Link href={`/shop/${s.id}`} key={s.id}>
									<div className={styles['TIL-shop']}>{s.name}</div>
								</Link>
							))}
							<div className={styles['accordion']} id="accordionExample">
								<h4 className={styles['accordion-header']} id="headingOne">
									<button
										className={styles['TIL-shopMore']}
										onClick={handleToggleButton}
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
									<div
										className={`${styles['TIL-accordion-body']} d-flex justify-content-center`}
									>
										還有 {remainingShops} 個店家
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`${styles['TIL-row']} row mt-2 mx-auto d-flex gy-5 col-9`}>
						{favoriteIcon.map((shop) => (
							<div className="col-6 col-sm-6 col-md-4 col-lg-3 p-0" key={shop.id}>
								<Shop
									shop={shop}
									onToggleFav={handleToggleFav}
									isFavorite={shop.fav}
									className={styles['TIL-Favorite']}
								/>
							</div>
						))}
					</div>
				</div>
				<div className="mb-3">
					<Pagination
						currentPage={1}
						totalPages={5}
						onPageChange={() => {}}
						changeColor="#fe6f67"
					/>
				</div>
			</div>
			<Footer />
		</>
	);
}

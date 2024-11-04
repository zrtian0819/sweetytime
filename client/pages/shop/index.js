import React, { useState } from 'react';
import Header from '@/components/header';
import styles from '@/styles/shop.module.scss';
import ShopCard from '@/components/shop/shopCard';
import Banner from '@/components/shop/banner';
import Footer from '@/components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from '@/components/pagination';
import ShopSidebar from '@/components/shopSidebar';
import { useFavorites } from '@/context/FavoritesContext';

export default function Index() {
	const shop = [
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
		{ shop_id: 21, name: 'CrewsDessert空服員的手作甜點', logo: 'mpapa_logo.png' },
		{ shop_id: 22, name: '歐卡諾諾 `O ka roll roll', logo: 'TokyoParisDessert_logo.png' },
		{ shop_id: 23, name: 'bonniesugar手作甜點專門店', logo: 'mosaicPastry_logo.jpg' },
		{ shop_id: 24, name: 'Chizup!', logo: 'Jingimoo_logo.png' },
		{ shop_id: 25, name: 'CrewsDessert空服員的手作甜點', logo: 'mpapa_logo.png' },
		{ shop_id: 26, name: '歐卡諾諾 `O ka roll roll', logo: 'TokyoParisDessert_logo.png' },
		{ shop_id: 27, name: 'bonniesugar手作甜點專門店', logo: 'mosaicPastry_logo.jpg' },
		{ shop_id: 28, name: 'Chizup!', logo: 'Jingimoo_logo.png' },
		{ shop_id: 29, name: 'CrewsDessert空服員的手作甜點', logo: 'mpapa_logo.png' },
		{ shop_id: 30, name: '歐卡諾諾 `O ka roll roll', logo: 'TokyoParisDessert_logo.png' },
		{ shop_id: 31, name: 'bonniesugar手作甜點專門店', logo: 'mosaicPastry_logo.jpg' },
		{ shop_id: 32, name: 'Chizup!', logo: 'Jingimoo_logo.png' },
		{ shop_id: 33, name: '吃吃喝喝MAISONGOURMANDE', logo: 'Maison_Gourmande_logo.jpg' },
		{ shop_id: 34, name: '艾波索 法式甜點', logo: 'Aposo_logo.png' },
		{ shop_id: 35, name: 'iFcake 如菓蛋糕', logo: 'iFcake_logo.jpg' },
		{ shop_id: 36, name: 'la vie bonbon 中山旗艦店', logo: 'laviebonbon_logo.jpg' },
		{ shop_id: 37, name: '橘村屋', logo: 'kitsumuraya_logo.jpg' },
		{ shop_id: 38, name: '羊毛與花．光點', logo: 'youmoutoohana_Coffee.logo.jpg' },
		{
			shop_id: 39,
			name: 'Lidée Sweet 時甜(敦化店)',
			logo: 'SEASON_Artisan_Pâtissier_logo.jpg',
		},
		{ shop_id: 40, name: '法點法食FADENFASAï', logo: 'FADENFASAï_logo.png' },
		{ shop_id: 41, name: '點冰室·ジャビン', logo: 'Give_Cold_Bird_logo.jpg' },
		{ shop_id: 42, name: '金雞母Jingimoo', logo: '法國主廚的甜點Nosif_logo.jpg' },
		{ shop_id: 43, name: '果昂甜品', logo: 'ami_logo.jpg' },
		{ shop_id: 44, name: '吃吃喝喝MAISONGOURMANDE', logo: 'Maison_Gourmande_logo.jpg' },
		{ shop_id: 45, name: '艾波索 法式甜點', logo: 'Aposo_logo.png' },
		{ shop_id: 46, name: 'iFcake 如菓蛋糕', logo: 'iFcake_logo.jpg' },
		{ shop_id: 47, name: 'la vie bonbon 中山旗艦店', logo: 'laviebonbon_logo.jpg' },
		{ shop_id: 48, name: '橘村屋', logo: 'kitsumuraya_logo.jpg' },
		{ shop_id: 49, name: '羊毛與花．光點', logo: 'youmoutoohana_Coffee.logo.jpg' },
		{
			shop_id: 50,
			name: 'Lidée Sweet 時甜(敦化店)',
			logo: 'SEASON_Artisan_Pâtissier_logo.jpg',
		},
		{ shop_id: 51, name: '法點法食FADENFASAï', logo: 'FADENFASAï_logo.png' },
		{ shop_id: 52, name: '點冰室·ジャビン', logo: 'Give_Cold_Bird_logo.jpg' },
		{ shop_id: 53, name: '金雞母Jingimoo', logo: '法國主廚的甜點Nosif_logo.jpg' },
		{ shop_id: 54, name: '果昂甜品', logo: 'ami_logo.jpg' },
	];

	const { favorites, toggleFavorite } = useFavorites();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	// 計算總頁數
	const totalPages = Math.ceil(shop.length / itemsPerPage);

	// 計算當前頁顯示的資料範圍
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = shop.slice(indexOfFirstItem, indexOfLastItem);

	return (
		<>
			<Header />
			<div className="TIL-banner">
				<Banner />
			</div>
			<div className={`${styles['TIL-body']} container my-5`}>
				<div className="row">
					<div className="col-lg-2 d-none d-lg-block p-0">
						<ShopSidebar />
					</div>
					<div className="col-12 col-lg-10 d-flex flex-column gap-5">
						<div className="row">
							{currentItems.map((shop) => (
								<div className="col-6 col-md-4 col-lg-3 " key={shop.shop_id}>
									<ShopCard
										shop={shop}
										//如果 favorites 和 favorites.shop 都存在
										isLiked={favorites?.shop?.[shop.shop_id] || false}
										handleToggleLike={() =>
											toggleFavorite('shop', shop.shop_id)
										}
									/>
								</div>
							))}
						</div>
						<div className="m-auto">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={(page) => setCurrentPage(page)}
								changeColor="#fe6f67"
							/>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

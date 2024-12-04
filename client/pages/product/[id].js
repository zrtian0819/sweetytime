import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '@/context/cartContext';
import { useUser } from '@/context/userContext';

import Header from '@/components/header';
import Footer from '@/components/footer';

import Image from 'next/image';

import { IoMdShare } from 'react-icons/io';
import LikeButton from '@/components/product/likeButton';
import { BiSolidCartAdd } from 'react-icons/bi';
import { FaCartPlus, FaRegSnowflake } from 'react-icons/fa';
import { LuWind } from 'react-icons/lu';
import { TbTemperatureMinus } from 'react-icons/tb';
import { ImSpoonKnife } from 'react-icons/im';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { showCustomToast } from '@/components/toast/CustomToastMessage';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Styles from '@/styles/productDetail.module.scss';
import Cart from '../cart';
import Swal from 'sweetalert2';

export default function ProductDetail(props) {
	const router = useRouter();
	const { user, logout } = useUser();
	const { id } = router.query;
	const [product, setProduct] = useState(null);
	const [productClass, setProductClass] = useState('');
	const [shopData, setShopData] = useState({});
	const [shopActivation, setShopActivation] = useState(null);
	const [productPhotos, setProductPhotos] = useState([]);
	const { cart, setCart, handleCart } = useCart();
	const [addCartAmount, setAddCartAmount] = useState(1);

	// 加入購物車
	const addMultiProducts = function (addAmount) {
		console.log('addAmount:', addAmount);
		handleCart(cart, id, 'increase', addAmount);
		setAddCartAmount(1);
		// if (user) {
		// 	if (addAmount > product.stocks) {
		// 		// showCustomToast('add', '', `已達庫存上限！僅加${product.stocks}件入購物車！`);
		// 	} else {
		// 		showCustomToast('add', '', `已加${addAmount}件入購物車！`);
		// 	}
		// }
	};

	const [guessedProducts, setGuessedProducts] = useState([]);
	const [featuredLessons, setFeaturedLessons] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				try {
					const response = await axios.get(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/details?id=${id}`
					);
					const productData = response.data.product;
					const keywordsArray = productData.keywords
						? productData.keywords.split(',')
						: [];
					setProduct({ ...productData, keywords: keywordsArray });
					setProductClass(response.data.product_class_name[0]?.class_name || '');
					setProductPhotos(response.data.photos);
					console.log('res.data', response.data);
					setShopData(response.data.product_shop_data[0]);
					setShopActivation(response.data.shop_activation[0].activation);

					// 取得猜你喜歡
					const guessedResponse = await axios.get(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/guessYouLike`
					);
					setGuessedProducts(guessedResponse.data);

					// 取得推薦課程
					const lessonsResponse = await axios.get(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/featureLessons`
					);
					setFeaturedLessons(lessonsResponse.data);

					// 檢查使用者是否登入，並設定收藏狀態
					if (user) {
						const likedResponse = await axios.get(
							`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userLikedProducts?userId=${user.id}`
						);
						const likedProductIds = new Set(
							likedResponse.data.map((item) => item.item_id)
						);
						setProduct((prevProduct) => ({
							...prevProduct,
							isLiked: likedProductIds.has(prevProduct.id),
						}));
					} else {
						setProduct((prevProduct) => ({
							...prevProduct,
							isLiked: false,
						}));
					}
				} catch (error) {
					if (error.response && error.response.status === 404) {
						handleNotAccessible();
					} else if (error.response.status === 400) {
						console.error('Invalid product ID');
						handleNotAccessible();
					} else {
						console.error('Error fetching data:', error);
					}
				}
			}
		};

		fetchData();
	}, [id, user]);

	// 商品無效時的處理
	const handleNotAccessible = async () => {
		await Swal.fire({
			icon: 'warning',
			title: '無效的商品',
			text: '商品不存在或無法購買',
			confirmButtonText: '返回上一頁',
		}).then((result) => {
			if (result.isConfirmed) {
				router.back(); // 用戶點擊確認後返回上一頁
			}
		});
	};
	useEffect(() => {
		if (product && shopActivation !== null) {
			if (!(shopActivation === 1 && product.available === 1 && product.deleted === 0)) {
				handleNotAccessible();
			}
		}
	}, [shopActivation, product]);

	// 處理收藏功能
	const toggleFavorite = async (userId, productId, prevIsliked) => {
		if (!user) {
			showCustomToast('', '', '登入後才可以收藏喔！');
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userLikedProducts`,
				{
					userId,
					productId,
				}
			);
			const { isFavorited } = response.data;

			setProduct((prevProduct) => ({
				...prevProduct,
				isLiked: isFavorited,
			}));

			showCustomToast('add', '', prevIsliked ? '已取消收藏！' : '已加入收藏！');
		} catch (error) {
			console.error('Error toggling favorite:', error);
			showCustomToast(
				'',
				'',
				prevIsliked ? '取消收藏失敗，請稍後再試' : '加入收藏失敗，請稍後再試'
			);
		}
	};

	// Slider元件的設定
	const settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
	};

	return (
		<>
			<Header />
			{shopActivation === 1 && product.available === 1 && product.deleted === 0 ? (
				<div className={`${Styles['section-product']}`}>
					<div className={`${Styles['product-container']}`}>
						<div className={`${Styles['product-photo']}`}>
							<div className={`${Styles['photo-container']}`}>
								<Link
									className={`${Styles['product-photo-shopLogo']}`}
									title={shopData.name}
									href={{
										pathname: '/product',
										query: {
											shopId: shopData.id,
											shopName: shopData.name,
											shopLogo: shopData.logo_path,
										},
									}}
								>
									<Image
										src={`/photos/shop_logo/${shopData.logo_path}`}
										fill
										style={{
											objectFit: 'contain', // cover, contain, none
										}}
										alt=""
									/>
								</Link>
								<Slider
									dotsClass={`slick-dots ${Styles['myDots']}`}
									customPaging={(i) => (
										<div
											style={{ width: '100%', height: '100%', opacity: '0' }}
										>
											{i}
										</div>
									)}
									{...settings}
									className={`${Styles['photoBox']}`}
								>
									{productPhotos.map((productPhoto, index) => (
										<img
											key={index}
											className={`${Styles['photo']}`}
											src={`/photos/products/${productPhoto}`}
										/>
									))}
								</Slider>
							</div>
						</div>
						<div className={`${Styles['product-info']}`}>
							<h2 className={`${Styles['product-name']}`}>{product.name}</h2>
							<h3 className={`${Styles['product-description']}`}>
								{product.description}
							</h3>
							<div className={`${Styles['product-types']}`}>
								<h3 className={`${Styles['product-class']}`}>{productClass}</h3>
								<div className={`${Styles['product-tags']}`}>
									{product.keywords &&
										Array.isArray(product.keywords) &&
										product.keywords.map((keyword, index) => (
											<h3 key={index} className={`${Styles['tag']}`}>
												#{keyword}
											</h3>
										))}
								</div>
							</div>
							<div className={`${Styles['product-others']}`}>
								<h3 className={`${Styles['stockAmount']}`}>
									剩餘{product.stocks}件
								</h3>
								{product.isLiked ? (
									<FaHeart
										color="white"
										onClick={() =>
											toggleFavorite(user?.id, product.id, product.isLiked)
										}
										style={{ height: '32px', width: '32px' }}
									/>
								) : (
									<FaRegHeart
										color="white"
										onClick={() =>
											toggleFavorite(user?.id, product.id, product.isLiked)
										}
										style={{ height: '32px', width: '32px' }}
									/>
								)}
								<IoMdShare className={`${Styles['shareBtn']}`} />
							</div>
							<div className={`${Styles['product-buy']}`}>
								<h2 className={Styles['price']}>
									NT{' '}
									{product.discount >= 0 && product.discount < 1
										? parseInt(product.price) * parseFloat(product.discount)
										: product.discount < 0
										? parseInt(product.price) + parseInt(product.discount)
										: parseInt(product.price)}
								</h2>

								<div className={`${Styles['amount']}`}>
									<div
										className={`${Styles['decrease']} me-1`}
										onClick={() => {
											if (addCartAmount > 1) {
												setAddCartAmount(addCartAmount - 1);
											}
										}}
									>
										-
									</div>
									<div className={`${Styles['addCartAmount']} mx-1`}>
										{addCartAmount}
									</div>
									<div
										className={`${Styles['increase']}`}
										onClick={() => setAddCartAmount(addCartAmount + 1)}
									>
										+
									</div>
								</div>
								<button
									className={`${Styles['addToCart']} ZRT-click`}
									onClick={() => addMultiProducts(addCartAmount)}
								>
									<span className={`${Styles['addToCart-text']}`}>
										加入購物車
									</span>
									<BiSolidCartAdd style={{ fontSize: 30 }} />
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}

			<div className={`${Styles['section-introduction']}`}>
				<h2
					className={`${Styles['sectionTitle']} ${Styles['introductionTitle']} text-white`}
				>
					INTRODUCTION
				</h2>
				<div className={`${Styles['introduction-container']} mx-auto`}>
					<div className={`${Styles['introduction-subtitle']} px-3`}>保存建議</div>
					<div className={`${Styles['advice-container']} container`}>
						<div className={`${Styles['advice']}`}>
							<div className={`${Styles['adviceCard']} px-0`}>
								<LuWind className={`${Styles['adviceIcon']}`} />
								<p className={`${Styles['adviceTitle']}`}>常溫保存</p>
								<p className={`${Styles['adviceContent']} ps-4 pe-3`}>
									若甜點含有奶油、鮮奶或蛋類，建議避免長時間放置於室溫超過兩小時。非易腐的乾式甜點（如餅乾或蛋糕乾）可在乾燥陰涼處保存，避免陽光直射。
								</p>
							</div>
							<div className={`${Styles['adviceCard']} px-0`}>
								<FaRegSnowflake className={`${Styles['adviceIcon']}`} />
								<p className={`${Styles['adviceTitle']}`}>冷藏保存</p>
								<p className={`${Styles['adviceContent']} ps-4 pe-3`}>
									請將含有乳製品或鮮奶油的甜點放入冰箱冷藏，保存溫度建議保持在 4°C
									以下，並在 2-3 天內享用，以確保最佳風味與安全性。
								</p>
							</div>
							<div className={`${Styles['adviceCard']} px-0`}>
								<TbTemperatureMinus className={`${Styles['adviceIcon']}`} />
								<p className={`${Styles['adviceTitle']}`}>冷凍保存</p>
								<p className={`${Styles['adviceContent']} ps-4 pe-3`}>
									部分甜點（如慕斯蛋糕、馬卡龍）可冷凍保存。將甜點包裝密封後放入冷凍庫，保存溫度應保持在
									-18°C 以下，並可保存至 1-2 週。食用前請提前 3-4
									小時放入冰箱解凍，避免直接在常溫下解凍，以免影響口感。
								</p>
							</div>
							<div className={`${Styles['adviceCard']} px-0`}>
								<ImSpoonKnife className={`${Styles['adviceIcon']}`} />
								<p className={`${Styles['adviceTitle']}`}>食用建議</p>
								<p className={`${Styles['adviceContent']} ps-4 pe-3`}>
									冷藏或冷凍過的甜點，食用前可稍微放置於室溫 10-15
									分鐘，讓甜點回溫至最佳口感。
								</p>
							</div>
						</div>
					</div>
					<div className={`${Styles['introduction-subtitle']} px-3`}>規格與配件</div>
					<p className={`${Styles['introduction-paragraph']} p-0`}>
						我們提供多樣化的運送服務，確保您的甜點在最佳狀態下送達。當地配送範圍內，提供快速冷藏運送，維持甜點的新鮮度與口感。外縣市則透過冷鏈宅配到府，確保每一份甜點安全直送至您手中。
					</p>

					<div className={`${Styles['introduction-subtitle']} px-3`}>運送方式</div>
					<p className={`${Styles['introduction-paragraph']} p-0`}>
						我們的甜點專注於手工製作，採用新鮮天然的食材，每個甜點都有獨特的風味。店內提供多種規格選擇，從單人份到家庭裝，滿足不同需求。隨甜點附上專屬包裝盒，讓您享受精緻的外觀與絕佳的口感，適合作為送禮或自享。
					</p>
				</div>
				<div className={`${Styles['']} d-flex justify-content-end`}>
					<p className={`${Styles['introduction-decorationText']}`}>
						Welcome to our dessert paradise! Every dessert is handcrafted with care,
						using only the finest ingredients to deliver a unique and delightful taste
						experience.
					</p>
				</div>
			</div>
			<div className={`${Styles['section-guessYouLike']}`}>
				<div className={`${Styles['guess-bigBgImg']}`}>
					<Image
						alt=""
						src={'/photos/background/bg-productDetailSec3.png'}
						style={{ objectFit: 'cover' }}
						fill
					/>
					<h2 className={`${Styles['sectionTitle']} ${Styles['guessTitle']}`}>
						Guess what you like
					</h2>
				</div>
				<div className={`${Styles['']} container-fluid`}>
					<h2 className={`${Styles['sectionTitle']} ${Styles['guessTitle_mobile']}`}>
						Guess what you like
					</h2>
					<p className={`${Styles['guess-decorationText']}`}>
						Give it a try and discover your sweet match made in heaven!
					</p>
					<div
						className={`${Styles['guess-row']} row row-cols-3 row-cols-lg-5 justify-content-center mx-auto gy-5 my-4`}
					>
						{guessedProducts.map((gProduct) => (
							<div key={gProduct.id} className={`${Styles['guess-col']} col my-2`}>
								<div
									className={`${Styles['guess-productImgContainer']} mx-auto ZRT-click`}
									title={gProduct.name}
								>
									<Link href={`/product/${gProduct.id}`}>
										<Image
											className={`${Styles['guess-productImg']} mx-auto`}
											src={`/photos/products/${gProduct.file_name}`}
											fill
											alt={`這個人還沒上傳圖片(id=${gProduct.id})`}
										/>
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={`${Styles['section-lessons']}`}>
				<h2 className={`${Styles['sectionTitle']} ${Styles['lessonsTitle']} text-white`}>
					Lessons
				</h2>
				<div className={`${Styles['']} d-flex justify-content-end`}>
					<p className={`${Styles['lessons-decorationText']}`}>
						專家指出，適量食用甜點不僅能滿足味蕾，還對身心健康有多種潛在的好處。甜點中的糖分能快速補充能量，特別在運動後或工作壓力大的時候，起到積極作用。此外，甜點還能促進大腦中與快樂情緒相關的多巴胺和血清素分泌，改善心情並減輕壓力。分享甜點更能促進社交場合的情感交流，增加幸福感。然而，專家提醒過量攝取糖分會帶來健康風險，適量享用甜點是保持健康的關鍵。
					</p>
					<p className={`${Styles['lessons-decorationText_mobile']}`}>
						Exciting news for dessert lovers! Stay tuned for our limited-edition
						specials, seasonal delights, and exclusive store events. Follow us for the
						latest updates and be the first to enjoy our newest creations and special
						offers. Don't miss out on any of the sweet moments!
					</p>
				</div>
				<div className="d-flex justify-content-end mb-1">
					<div
						className={`${Styles['lessons-cardsTrail']}`}
						style={{
							'--trail-item-Width': '377px',
							'--trail-item-Height': '400px',
							'--trail-item-Width-mobile': '196px',
							'--trail-item-Height-mobile': '210px',
							'--quantity': '5',
						}}
					>
						<div className={`${Styles['lessons-cardsList']}`}>
							{featuredLessons.map((fLesson, index) => (
								<Link
									key={fLesson.id}
									href={`/lesson/${fLesson.id}`}
									className={`${Styles['lessons-card']} ZRT-click-fast`}
									style={{
										'--trail-item-position': index + 1,
										animationDelay: `${(14 / 5) * index}s`,
									}}
								>
									<div className={`${Styles['cardImgContainer']}`}>
										<Image
											alt=""
											src={`/photos/lesson/${fLesson.img_path}`}
											className={`${Styles['cardImg']}`}
											fill
										/>
										{/* <div className={`${Styles['cardBlur']}`}></div> */}
									</div>
									<h3 className={`${Styles['cardTitle']}`}>{fLesson.name}</h3>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
			<Footer />

			<style>{`li.slick-active {background-color: #FF4848 !important;}`}</style>
		</>
	);
}

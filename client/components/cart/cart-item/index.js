import React, { useState, useEffect } from 'react';
import sty from './cart-item.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { Icon, Checkbox, Button, IconButton, DeleteIcon } from '@mui/material';
import { useCart } from '@/context/cartContext';
import axios from 'axios';

export default function CartItem({
	count = '數量?',
	pid = '產品pid?',
	selected = false,
	setLoading,
}) {
	const [product, setProduct] = useState('');
	const [photo, setPhoto] = useState('');
	const { cart, setCart, handleCart } = useCart();

	useEffect(() => {
		//應改可以簡寫但先這樣
		if (pid) {
			// 抓取產品資訊
			axios
				.get(`http://localhost:3005/api/cart/product/${pid}`)
				.then((res) => {
					setProduct(res.data[0]);
				})
				.catch((err) => {
					console.log(err);
				});

			// 抓取產品照片
			axios
				.get(`http://localhost:3005/api/cart/product_photo/${pid}`)
				.then((res) => {
					setPhoto(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		// setLoading(false);
	}, []);

	useEffect(() => {
		//將資料庫獲取的資訊存入
		let targetCart;
		let found;
		let nextCart = [...cart];
		if (product != '') {
			nextCart.forEach((shop) => {
				found = shop.cart_content.find((pd) => {
					return pd.product_id == pid;
				});
				if (found) {
					targetCart = found;
					return;
				}
			});

			for (let key in product) {
				targetCart[key] = product[key];
			}
			setCart(nextCart);
		}
	}, [product]);

	useEffect(() => {
		//將資料庫獲取的資訊存入
		let targetCart;
		let found;
		let nextCart = [...cart];
		if (photo != '') {
			nextCart.forEach((shop) => {
				found = shop.cart_content.find((pd) => {
					return pd.product_id == pid;
				});
				if (found) {
					targetCart = found;
					return;
				}
			});

			targetCart.photo_name = photo.file_name;
			setCart(nextCart);
		}
	}, [photo]);

	return (
		<div className={`${sty['ZRT-product']} container-fluid py-2`}>
			<div className="row px-0 px-lg-2">
				{/* 勾選區 */}
				<div className="col-1 ZRT-center">
					<Checkbox
						checked={selected}
						disabled={product.stocks == 0}
						sx={{ color: '#fe6f67', '&.Mui-checked': { color: '#fe6f67' } }}
						onClick={() => {
							handleCart(cart, pid, 'toggleSingleSelected');
						}}
					/>
				</div>

				{/* 圖示區 */}
				<div className={`${sty['ZRT-picBox']} col-2 align-content-center`}>
					<Link href={`product/${pid}`}>
						<Image
							src={pid ? `/photos/products/${photo.file_name}` : ''}
							height={200}
							width={200}
							style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
							alt={product.name || `product_id:${pid}`}
							priority
						/>
					</Link>
				</div>

				{/* 品名價格區 */}
				<div className="col col-lg nameAndPrice container">
					<div className="row h-100">
						<div className="col-12 col-lg-7 align-content-center ">
							<h4 className="name m-0">
								{product.name}

								<div
									className={`mt-3 ${
										product.stocks == 0 ? 'text-danger' : 'text-secondary'
									}`}
								>
									庫存:{product.stocks}
								</div>
							</h4>
						</div>
						<div className="col-12 col-lg-5 align-content-center text-danger">
							<h3 className="price m-0">$NT{product.price * product.discount}</h3>
						</div>
					</div>
				</div>

				{/* 數量區 */}
				<div className="col-3 col-lg-2 ZRT-center">
					<div
						className={`${sty['ZRTRButton']} ZRT-center ZRT-click`}
						onClick={() => {
							// setQuantity(quantity - 1);
							handleCart(cart, pid, 'decrease');
						}}
					>
						<FaMinus />
					</div>
					<div className={`${sty['ZRTCount']}`}>{count}</div>
					<div
						className={`${sty['ZRTRButton']} ZRT-center ZRT-click`}
						onClick={() => {
							// setQuantity(quantity + 1);
							handleCart(cart, pid, 'increase');
						}}
					>
						<FaPlus />
					</div>
				</div>

				{/* 刪除區 */}
				<div className={`${sty['ZRTDelButton']} col-2 ZRT-center`}>
					<FaTrash
						className="ZRT-click"
						onClick={() => {
							handleCart(cart, pid, 'delete');
						}}
					/>
				</div>
			</div>
		</div>
	);
}

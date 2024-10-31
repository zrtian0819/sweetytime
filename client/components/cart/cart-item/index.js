import React, { useState, useEffect } from 'react';
import sty from './cart-item.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Icon, Checkbox, Button, IconButton, DeleteIcon } from '@mui/material';

export default function CartItem({
	src = '尚未傳入圖片src',
	name = '品名?',
	price = '價格?',
	count = '數量?',
	del = false,
	link = '產品id?',
}) {
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (quantity == 0) {
			//跳出是否刪除的提示同意才刪除
			setQuantity(1);
		}
	}, [quantity]);

	return (
		<div className="container-fluid py-2">
			<div className="row px-0 px-lg-2">
				{/* 勾選區 */}
				<div className="col-1 ZRT-center">
					<Checkbox sx={{ color: '#fe6f67', '&.Mui-checked': { color: '#fe6f67' } }} />
				</div>

				{/* 圖示區 */}
				<div className="col-2 align-content-center">
					<Link href={`product/${link}`}>
						<Image
							src="/photos/products/00_ChizUp_cheesecake.jpg"
							height={200}
							width={200}
							style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
							alt={name}
						/>
					</Link>
				</div>

				{/* 品名價格區 */}
				<div className="col col-lg nameAndPrice container">
					<div className="row h-100">
						<div className="col-12 col-lg-5 align-content-center ">
							<h4 className="name m-0">方磚起司蛋糕方磚起司蛋糕方磚起司蛋糕</h4>
						</div>
						<div className="col-12 col-lg-7 align-content-center text-danger">
							<h4 className="price m-0">$NT{'1000'}</h4>
						</div>
					</div>
				</div>

				{/* 數量區 */}
				<div className="col-3 col-lg-2 ZRT-center">
					<div
						className={`${sty['ZRTRButton']} ZRT-center ZRT-click`}
						onClick={() => {
							setQuantity(quantity - 1);
						}}
					>
						<FaMinus />
					</div>
					<div className={`${sty['ZRTCount']}`}>{quantity}</div>
					<div
						className={`${sty['ZRTRButton']} ZRT-center ZRT-click`}
						onClick={() => {
							setQuantity(quantity + 1);
						}}
					>
						<FaPlus />
					</div>
				</div>

				{/* 刪除區 */}
				<div className={`${sty['ZRTDelButton']} col-2 ZRT-center text-danger ZRT-click`}>
					<IoCloseOutline />
				</div>
			</div>
		</div>
	);
}

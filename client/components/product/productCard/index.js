import React, { useState, useEffect } from 'react';
import Styles from './productCard.module.scss';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';

export default function LessonCard(props) {
	const [isLike, setIsLike] = useState(false);
	const handleLike = () => {
		setIsLike(!isLike);
	};
	return (
		<>
			<div className={`${Styles['product-card']} card m-3 test-mode`}>
				<div className={`${Styles['product-card-top']}`}>
					<Image
						src={'/photos/lesson/28_cake_nuts.jpg'}
						fill
						className={Styles['product-card-img']}
					/>
				</div>
				<div className={`${Styles['product-card-body']} card-body`}>
					<div className={Styles['card-body-upper']}>
						<h3>蒙布朗栗子蛋糕</h3>
						<FaHeart
							className={Styles['product-card-icon']}
							size={30}
							color={isLike ? '#fe6f67' : 'grey'}
							onClick={handleLike}
						/>
					</div>
					<div className={`${Styles['product-card-body-lower']}`}>
						<h4>NTD 1500</h4>
						<button className="btn ZRT-center">
							<FaCartShopping />
							加入購物車
						</button>
					</div>
					{/* <div className={Styles['product-hover-content']}>
						<h4>課程介紹</h4>
						<p>
							很多人說秋天是讓人想吃栗子的季節，許多甜點名店都會把蒙布朗蛋糕列為秋季限定甜點。但是，我每個季節都想吃它！
						</p>
						<button className="btn">
							<FaArrowRightLong size={20} />
							看更多
						</button>
					</div> */}
				</div>
			</div>
		</>
	);
}

import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function LessonCard({
	name = '栗子蒙布朗',
	date = '2024/11/3(日)',
	price = 'NTD1500',
}) {
	const [isLike, setIsLike] = useState(false);
	const handleLike = () => {
		setIsLike(!isLike);
	};
	return (
		<>
			<div className={`${Styles['CTH-card']} card m-3`}>
				<div className={`${Styles['CTH-card-top']}`}>
					<Image
						src={'/photos/lesson/28_cake_nuts.jpg'}
						width={200}
						height={200}
						className={Styles['CTH-lesson-card-img']}
					/>
					{isLike ? (
						<FaHeart
							className={`${Styles['CTH-lesson-card-icon']}`}
							size={30}
							onClick={handleLike}
						/>
					) : (
						<FaRegHeart
							className={Styles['CTH-lesson-card-icon']}
							size={30}
							onClick={handleLike}
						/>
					)}
				</div>
				<div className={`${Styles['CTH-card-body']} card-body`}>
					<div className="card-body-left">
						<h4>{name}</h4>
						<p>{date}</p>
						<h4>{price}</h4>
					</div>
					<div className={`${Styles['CTH-card-body-right']} ms-auto`}>
						<button className="btn">
							<FaArrowRightLong size={20} />
							看更多
						</button>
					</div>
					<div className={Styles['CTH-hover-content']}>
						<h4>課程介紹</h4>
						<p>
							很多人說秋天是讓人想吃栗子的季節，許多甜點名店都會把蒙布朗蛋糕列為秋季限定甜點。但是，我每個季節都想吃它！
						</p>
						<button className="btn">
							<FaArrowRightLong size={20} />
							看更多
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

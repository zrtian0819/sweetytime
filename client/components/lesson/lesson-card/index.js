import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useUser } from '@/context/userContext';
import likeSweet from '@/components/sweetAlert/like';
import axios from 'axios';

export default function LessonCard({
	id = 1,
	img = '28_cake_nuts.jpg',
	name = '栗子蒙布朗',
	date = '2024/11/3(日)',
	price = 'NTD1500',
	des = '很多人說秋天是讓人想吃栗子的季節，許多甜點名店都會把蒙布朗蛋糕列為秋季限定甜點。但是，我每個季節都想吃它！',
	like = false,
	student = '1',
}) {
	const { user } = useUser();
	if (!id || !img || !name || !date || !price || !des) {
		return null;
	}
	const [isLike, setIsLike] = useState(like);
	const sliceDes = `${des.slice(0, 20)} ...`;
	const handleLike = (id) => {
		if (user) {
			const data = {
				user: user.id,
			};
			if (isLike == true) {
				axios
					.post(`http://localhost:3005/api/lesson/likeDel/${id}`, data)
					.then((res) => setIsLike(!isLike))
					.catch((error) => console.error('失敗', error));
			} else {
				axios
					.post(`http://localhost:3005/api/lesson/like/${id}`, data)
					.then((res) => setIsLike(!isLike))
					.catch((error) => console.error('失敗', error));
			}
		} else {
			likeSweet();
		}
	};

	return (
		<>
			<div className={`${Styles['CTH-card']} card m-3`}>
				<div className={`${Styles['CTH-card-top']}`}>
					<Image
						src={`/photos/lesson/${img}`}
						width={200}
						height={200}
						className={Styles['CTH-lesson-card-img']}
					/>
					{isLike ? (
						<div
							className={`${Styles['CTH-lesson-card-icon']} ZRT-click-fast`}
							style={{
								display: 'inline-block',
								padding: '5px',
								borderRadius: '50%',
							}}
						>
							<FaHeart
								size={30}
								onClick={(e) => {
									handleLike(id);
								}}
							/>
						</div>
					) : (
						<div
							className={`${Styles['CTH-lesson-card-icon']} ZRT-click-fast`}
							style={{
								display: 'inline-block',
								padding: '5px',
								borderRadius: '50%',
							}}
							onClick={(e) => {
								handleLike(id);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="#ffffffd0"
								stroke="#fe6f67"
								strokeWidth="2"
							>
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							</svg>
						</div>
					)}
				</div>
				<div className={`${Styles['CTH-card-body']} card-body`}>
					<div className="card-body-left">
						<h4>{name}</h4>
						<p>{date}</p>
						<h5>報名人數：{student}</h5>
						<h4>{price}</h4>
					</div>
					<div className={`${Styles['CTH-card-body-right']} ms-auto`}>
						<button className="ZRT-btn ZRT-click ZRT-btn-rounded px-3 py-1 ZRT-ls-1">
							看更多
							<FaArrowRightLong size={20} className="ms-1" />
						</button>
					</div>
					<div className={Styles['CTH-hover-content']}>
						<h4>課程介紹</h4>
						<div
							dangerouslySetInnerHTML={{
								__html: sliceDes,
							}}
						></div>
						<Link href={`/lesson/${id}`}>
							<button className="ZRT-btn ZRT-click ZRT-btn-rounded px-3 py-1 ZRT-ls-1">
								看更多
								<FaArrowRightLong size={20} className="ms-1" />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

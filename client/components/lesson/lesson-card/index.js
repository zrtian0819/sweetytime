import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useUser } from '@/context/userContext';
import axios from 'axios';

export default function LessonCard({
	id = 1,
	img = '28_cake_nuts.jpg',
	name = '栗子蒙布朗',
	date = '2024/11/3(日)',
	price = 'NTD1500',
	des = '很多人說秋天是讓人想吃栗子的季節，許多甜點名店都會把蒙布朗蛋糕列為秋季限定甜點。但是，我每個季節都想吃它！',
	like = false,
}) {
	const { user } = useUser();
	if (!id || !img || !name || !date || !price || !des) {
		return null;
	}
	const [isLike, setIsLike] = useState(like);
	const sliceDes = `${des.slice(0, 20)} ...`;
	console.log('喜歡狀態', isLike);
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
			alert('登入才能收藏喔');
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
						<FaHeart
							className={`${Styles['CTH-lesson-card-icon']}`}
							size={30}
							onClick={(e) => {
								handleLike(id);
							}}
						/>
					) : (
						<FaRegHeart
							className={Styles['CTH-lesson-card-icon']}
							size={30}
							onClick={(e) => {
								handleLike(id);
							}}
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
						<div
							dangerouslySetInnerHTML={{
								__html: sliceDes,
							}}
						></div>
						<Link href={`/lesson/${id}`}>
							<button className="btn">
								<FaArrowRightLong size={20} />
								看更多
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

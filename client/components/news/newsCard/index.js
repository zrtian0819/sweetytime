import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function NewsCard({
	id = 1,
	title = '美味料理食譜：經典法式甜點！檸檬萊姆塔的酸甜滋味',
	content = '偷偷告訴妳，檸檬塔的故事\n這是一道傳統且歷史久遠，並且已有多樣化演變的甜點。從名稱 Tarte au Citron 或許會直接聯想到甜點王國-法國，不過檸檬塔最早緣起和流行於地中海一帶，而法國的檸檬塔最早起源自法國南部城市-芒通 (Menton, France)。',
	img = 'dessertStomach.jpg',
	activation = 1,
}) {
	// 出現文字區後隱藏
	const [isHide, setIsHide] = useState(false);
	// 判斷狀態
	if (activation !== 1) return null;

	// 去除標籤並限制字數
	const truncateContent = (content) => {
		// 去除 HTML 標籤
		const text = content.replace(/<[^>]+>/g, '').trim();

		// 限制字數為 55 字
		return text.length > 55 ? text.slice(0, 55) + '...' : text;
	};
	return (
		<>
			{/* 卡片區 */}
			<div className={`${Styles['LYT-card']} card`}>
				<div className={`${Styles['LYT-card-top']}`}>
					<Image
						src={`/photos/articles/${img}`}
						width={200}
						height={200}
						className={Styles['LYT-news-card-img']}
					/>
				</div>

				{/* 卡片下方文字 */}

				<div className={`${Styles['LYT-card-body']} card-body`}>
					<div className="card-body-left">
						<p>{`${title.slice(0, 25) + '...'} `}</p>
						{!isHide && (
							<div className={Styles['LYT-card-body-right']}>
								<button className={'btn '}>
									<FaArrowRightLong size={20} />
									看更多
								</button>
							</div>
						)}
					</div>

					{/* 卡片說明區 */}
					<div
						className={Styles['LYT-hover-content']}
						onMouseEnter={() => setIsHide(true)}
						onMouseLeave={() => setIsHide(false)}
					>
						<div className={Styles['LYT-ellipsis']}>{truncateContent(content)}</div>
						{isHide && (
							<Link href={`/news/${id}`}>
								<button className="btn">
									<FaArrowRightLong size={20} />
									看更多
								</button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

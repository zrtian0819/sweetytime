import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function NewsCard(props) {
	return (
		<>
			{/* 卡片區 */}
			<div className={`${Styles['LYT-card']} card`}>
				<div className={`${Styles['LYT-card-top']}`}>
					<Image
						src={'/photos/articles/dessertStomach.jpg'}
						width={200}
						height={200}
						className={Styles['LYT-news-card-img']}
					/>
				</div>

				{/* 卡片下方文字 */}
				<div className={`${Styles['LYT-card-body']} card-body`}>
					<div className="card-body-left">
						<p>美味料理食譜：經典法式甜點！檸檬萊姆塔的酸甜滋味</p>

						<div className={Styles['LYT-card-body-right']}>
							<button className="btn">
								<FontAwesomeIcon icon={faArrowRight} />
								看更多
							</button>
						</div>
					</div>
					{/* 卡片說明區 */}
					<div className={Styles['LYT-hover-content']}>
						<p>
							偷偷告訴妳，檸檬塔的故事
							這是一道傳統且歷史久遠，並且已有多樣化演變的甜點。從名稱 Tarte au Citron
							或許會直接聯想到甜點王國-法國，不過檸檬塔最早緣起和流行於地中海一帶，而法國的檸檬塔最早起源自法國南部城市-芒通
							(Menton,
							France)。在芒通每年會舉辦檸檬節，其中檸檬塔始終是節慶的一大亮點。而由於檸檬塔的獨到好滋味，現在在法國的甜品店，咖啡廳或下午茶坊都可以看到它的身影，近年來台灣、日本也受法國甜點文化感染，於是也有越來越多的店，和越來越多師傅開始製作檸檬塔。
						</p>
						<button className="btn">
							<FontAwesomeIcon icon={faArrowRight} />
							看更多
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

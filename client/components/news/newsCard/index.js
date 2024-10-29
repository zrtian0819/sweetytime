import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart } from '@fortawesome/free-solid-svg-icons';


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
						<h4 className='fw-bold'>美味料理食譜：經典法式甜點！檸檬萊姆塔的酸甜滋味</h4>
						<p>
							偷偷告訴妳，檸檬塔的故事
							這是一道傳統且歷史久遠，並且已有多樣化演變的甜點。
							偷偷告訴妳，檸檬塔的故事
							這是一道傳統且歷史久遠，並且已有多樣化演變的甜點。	
							偷偷告訴妳，檸檬塔的故事
							這是一道傳統且歷史久遠，並且已有多樣化演變的甜點。	
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

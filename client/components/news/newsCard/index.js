import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function NewsCard({ id = 1, title = '', content = '', img = 'dessertStomach.jpg' }) {
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
						<p>{title}</p>
						<div className={Styles['LYT-card-body-right']}>
							<Link href={`/news/newsDetail?id=${id}`}>
								<button className="btn">
									<FontAwesomeIcon icon={faArrowRight} />
									看更多
								</button>
							</Link>
						</div>
					</div>
					{/* 卡片說明區 */}
					<div className={Styles['LYT-hover-content']}>
						<p>{content}</p>
						<Link href={`/news/newsDetail?id=${id}`}>
							<button className="btn">
								<FontAwesomeIcon icon={faArrowRight} />
								看更多
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

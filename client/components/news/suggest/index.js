import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Suggest(props) {
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
						<h4 className="text-white">乳酪蛋糕</h4>
						<div className={Styles['LYT-price']}>
							<div className={Styles['LYT-delPrice']}>
								<p>$999</p>
							</div>
							<p>$650</p>
						</div>

						<div className={Styles['LYT-card-body-right']}>
							<button className="btn">
								<FontAwesomeIcon icon={faCartArrowDown} />
								加入購物車
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

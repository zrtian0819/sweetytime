import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function Suggest({
	id = 1,
	file_name = '00_ChizUp_cheesecake.jpg',
	name = '【正方形】招牌黃金起司',
	price = 'NTD750',
	des = '黃金比例的乳酪配方，嚴選天然食材，繁複手工分蛋製作及水浴烘焙法，提昇綿密滑順口感，金黃色的外表下，蘊藏著深不可測的濃郁起司風味',
}) {
	return (
		<>
			<div className={`${Styles['LYT-card']} card m-3`}>
				<div className={`${Styles['LYT-card-top']}`}>
					<Image
						src={`/photos/products/${file_name}`}
						width={200}
						height={200}
						className={Styles['LYT-news-card-img']}
					/>
				</div>
				<div className={`${Styles['LYT-card-body']} card-body`}>
					<div className="card-body-left">
						<h4>{name}</h4>
						<h4>{price}</h4>
					</div>
					<div className={`${Styles['LYT-card-body-right']} ms-auto`}>
						<button className="btn">
							<FaArrowRightLong size={20} />
							看更多
						</button>
					</div>
					<div className={Styles['LYT-hover-content']}>
						<h4>產品介紹</h4>
						<p className={Styles['LYT-ellipsis']}>{`${des.slice(0, 50)} ...`}</p>
						<Link href={`/product/${id}`}>
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

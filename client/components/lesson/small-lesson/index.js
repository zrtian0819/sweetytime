import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FaArrowRightLong } from 'react-icons/fa6';
import Link from 'next/link';

export default function SmLesson({
	id = 1,
	month = '10',
	date = '05',
	name = '蒙布朗蛋糕',
	dateStr = '2024-08-22 00:00:00',
	price = 1500,
}) {
	const [chineseMonth, setChineseMonth] = useState();
	const newDate = new Date(dateStr);
	const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
	const dayOfWeek = daysOfWeek[newDate.getDay()];
	useEffect(() => {
		switch (month) {
			case '01':
				setChineseMonth('一月');
				break;
			case '02':
				setChineseMonth('二月');
				break;
			case '03':
				setChineseMonth('三月');
				break;
			case '04':
				setChineseMonth('四月');
				break;
			case '05':
				setChineseMonth('五月');
				break;
			case '06':
				setChineseMonth('六月');
				break;
			case '07':
				setChineseMonth('七月');
				break;
			case '08':
				setChineseMonth('八月');
				break;
			case '09':
				setChineseMonth('九月');
				break;
			case '10':
				setChineseMonth('十月');
				break;
			case '11':
				setChineseMonth('十一月');
				break;
			case '12':
				setChineseMonth('十二月');
				break;
		}
	}, [month]);
	return (
		<>
			<div className={`container ${styles['CTH-sm-lesson']}`}>
				<div className="row justify-content-around align-items-center">
					<div className={`col-3 ${styles['CTH-time-box']}`}>
						<div>{chineseMonth}</div>
						<div>{date}</div>
						<div>({dayOfWeek})</div>
					</div>
					<div className="text-start col-6 d-flex flex-column justify-content-center">
						<h4>{name}</h4>
						<h4>NTD {price}</h4>
					</div>

					<div className="col-1 ZRT-center">
						<Link href={`/lesson/${id}`}>
							<button className={styles['CTH-btn']}>
								<FaArrowRightLong size={30} />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

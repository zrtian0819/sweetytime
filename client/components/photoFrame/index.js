import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './photoFrame.module.scss';
import adjustBrightness from '@/lib/utils/colorCoverter';

export default function PhotoFrams({ width = 100, height = 100, src, color }) {
	//原本的
	// const frameColor = [
	// 	'#F2C2C9',
	// 	'#EC6D76',
	// 	'#E8B2BB',
	// 	'#F2C2C9',
	// 	'#F2C2C9',
	// 	'#EC6D76',
	// 	'#EC6D76',
	// 	'#E8B2BB',
	// 	'#E8B2BB',
	// 	'#EA626C',
	// 	'#EA626C',
	// 	'#E8B2BB',
	// 	'#EA626C',
	// 	'#E8B2BB',
	// 	'#E8B2BB',
	// 	'#EA626C',
	// ];

	const frameColor = [
		// 溫暖粉色系列
		'#F0888F', // 基準色
		'#F4A1A7', // 稍淺的粉色
		'#EC7078', // 稍深的粉色
		'#F7B8BD', // 更淺的粉色
		'#E85D66', // 更深的粉色

		// 粉色與奶油色系列
		'#FFF0E8', // 奶油色
		'#FFE4E1', // 淺奶粉色
		'#E8A9AE', // 深粉色
		'#FFC5BD', // 珊瑚粉

		// 粉色與灰色系列
		'#F5F5F5', // 淺灰
		'#E6E6E6', // 中灰
		'#F7A5AB', // 淺粉
		'#E87078', // 深粉

		// 粉色與綠色系列
		'#E8F0EF', // 非常淺的薄荷綠
		'#D4E8E6', // 淺薄荷綠
		'#E87982', // 深粉
	];

	if (!color) {
		// 如果沒有傳color進來,就隨機從以上陣列挑選一個相框顏色
		const colorIndex = Math.floor(Math.random() * frameColor.length);
		color = frameColor[colorIndex];
	}

	//判定傳入的src是否有undefined
	const hasUndefined = src.includes('undefined');

	let brighter = adjustBrightness(color, +70);
	let darker = adjustBrightness(color, -7);
	let shdowBright = adjustBrightness(color, +40);
	let shdowDarker = adjustBrightness(color, -20);

	return (
		<>
			<div className={`outerFrame ${styles['outerFrame']}`}>
				<div className={`innerFrame ${styles['innerFrame']}`}>
					<div className={`${styles['photo']}`}>
						{!hasUndefined && <Image src={src} width={0} height={0} alt="" />}
					</div>
				</div>

				<div className={`${styles['scar']} ${styles['scar1']} scar`}></div>
				<div className={`${styles['scar']} ${styles['scar2']} scar`}></div>
				<div className={`${styles['scar']} ${styles['scar3']} scar`}></div>
				<div className={`${styles['scar']} ${styles['scar4']} scar`}></div>
			</div>

			<style jsx>
				{`
					.outerFrame {
						width: ${width}px;
						height: ${height}px;
						background: linear-gradient(to right, ${brighter}, ${darker});
					}

					.innerFrame {
						background: linear-gradient(to right, ${brighter}, ${darker});
						box-shadow: inset 5px 5px 7px ${shdowDarker},
							inset -5px -5px 8px ${shdowBright};
					}

					.scar {
						background-color: ${darker};
					}
				`}
			</style>
		</>
	);
}

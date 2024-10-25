import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './photoFrame.module.scss';
import adjustBrightness from '@/lib/utils/colorCoverter';

export default function PhotoFrams({ width = 100, height = 100, src = '', color = '#F2C5CB' }) {
	let brighter = adjustBrightness(color, +70);
	let darker = adjustBrightness(color, -7);

	let shdowBright = adjustBrightness(color, +40);
	let shdowDarker = adjustBrightness(color, -20);

	return (
		<>
			<div className={`outerFrame ${styles['outerFrame']}`}>
				<div className={`innerFrame ${styles['innerFrame']}`}>
					<div className={`${styles['photo']}`}>
						{src != '' && <Image src={src} width={0} height={0} />}
					</div>
				</div>

				<div className={`${styles['scar']} ${styles['scar1']}`}></div>
				<div className={`${styles['scar']} ${styles['scar2']}`}></div>
				<div className={`${styles['scar']} ${styles['scar3']}`}></div>
				<div className={`${styles['scar']} ${styles['scar4']}`}></div>
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
            box-shadow: inset 5px 5px 7px ${shdowDarker} , inset -5px -5px 8px ${shdowBright};
					}
				`}
			</style>
		</>
	);
}

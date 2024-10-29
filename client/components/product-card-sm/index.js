import React, { useState, useEffect } from 'react';
import sty from './product-card-sm.module.scss';
import Link from 'next/link';

export default function ProductCardSM({
	src = '尚未傳入src',
	name = '尚未傳入name',
	link = '尚未傳入link',
	hover = 'false',
	width = 200,
}) {
	return (
		<>
			{/* hover效果還未完成 */}
			<Link className={`${sty['outerLink']}`} href={link}>
				<div
					className={`ZRT-pcs-picBox ZRT-click ${sty['picBox']} ${
						hover ? 'ZRT-pcs-picBox-hover' : ''
					}`}
				></div>
			</Link>

			<style jsx>
				{`
					.ZRT-pcs-picBox {
						background: url(${src}) center center / cover;
						width: ${width}px;
					}

					@media (max-width: 768px) {
						.ZRT-pcs-picBox {
							width: ${width - 20}px;
						}
					}

					@media (max-width: 576px) {
						.ZRT-pcs-picBox {
							width: ${width - 40}px;
						}
					}
				`}
			</style>
		</>
	);
}

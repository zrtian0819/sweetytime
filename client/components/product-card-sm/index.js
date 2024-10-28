import React, { useState, useEffect } from 'react';
import sty from './product-card-sm.module.scss';

export default function ProductCardSM({
	src = '尚未傳入src',
	name = '尚未傳入name',
	link = '尚未傳入link',
	hover = 'false',
}) {
	return (
		<>  
            {/* hover效果還未完成 */}
			<div
				className={`ZRT-pcs-picBox ZRT-click ${sty['picBox']} ${
					hover ? 'ZRT-pcs-picBox-hover' : ''
				}`}
			></div>

			<style jsx>
				{`
					.ZRT-pcs-picBox {
						background: url(${src}) center center / cover;
					}
				`}
			</style>
		</>
	);
}

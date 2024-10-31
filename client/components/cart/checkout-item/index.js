import React, { useState, useEffect } from 'react';
import sty from './checkout-item.module.scss';
import Image from 'next/image';

export default function CheckoutItem({ src, link, name, price, count }) {
	return (
		<div className={`${sty['checkoutItem']} container py-2 `}>
			<div className="row h-100">
				<div className="ImgArea col-3">
					<div className={`${sty['imgBox']} me-3 d-flex`}>
						<Image src={src} width={100} height={100} alt={name} />
					</div>
				</div>
				<div className="nameArea col">
					<h4 className={`${sty['productName']} h-100 col`}>{name}</h4>
				</div>
				<div className="priceArea col">
					<h4 className={`${sty['productPrice']} h-100 col`}>$NT {price}</h4>
				</div>
				<div className="priceArea col">
					<h4 className={`${sty['productCount']} h-100 col`}>{count} 件</h4>
				</div>
			</div>
		</div>
	);
}

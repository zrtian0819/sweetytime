import React, { useState, useEffect } from 'react';
import sty from './checkout-item.module.scss';
import Image from 'next/image';

export default function CheckoutItem({
	type = 'product',
	src,
	link,
	name,
	price,
	count,
	date,
	location,
	classroom,
	quota,
}) {
	return (
		<div className={`${sty['checkoutItem']} container py-2 `}>
			<div className="row h-100">
				<div className="ImgArea col-3">
					<div className={`${sty['imgBox']} me-3 d-flex`}>
						<Image src={src} width={100} height={100} alt={name} />
					</div>
				</div>
				<div className="nameArea col-5 d-flex flex-column justify-content-center">
					{type == 'lesson' ? (
						<>
							<h4 className={`${sty['productName']}`}>{name}</h4>
							<h5>課程日期：{date}</h5>
							<h5>
								課程地點：{location}/{classroom}
							</h5>
							<h5>剩餘名額：{quota}</h5>
						</>
					) : (
						<h4 className={`${sty['productName']} h-100 col`}>{name}</h4>
					)}
				</div>
				<div className="priceArea col">
					<h4 className={`${sty['productPrice']} h-100 col`}>$NT {price}</h4>
				</div>
				<div className="priceArea col">
					{type == 'product' ? (
						<h4 className={`${sty['productCount']} h-100 col`}>{count} 件</h4>
					) : (
						''
					)}
					{type == 'lesson' ? (
						<h4 className={`${sty['productCount']} h-100 col`}>一堂課</h4>
					) : (
						''
					)}
				</div>
			</div>
		</div>
	);
}

import React, { useState, useEffect } from 'react';
import Styles from './cart-item.module.scss';
import Image from 'next/image';

export default function CartItem(props) {
	const [quantity, setQuantity] = useState(1);

	return (
		<div className="container-fluid py-2">
			<div className="row px-0 px-lg-2">
				<div className="col-1 align-content-center">
					<input type="checkbox" />
				</div>
				<div className="col-2 align-content-center">
					<Image
						src="/photos/products/00_ChizUp_cheesecake.jpg"
						height={200}
						width={200}
						style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
						alt="productImage"
					/>
				</div>
				<div className="col-4 align-content-center d-none d-lg-block">
					<h4 className="name">方磚起司蛋糕</h4>
				</div>
				<div className="col-2 align-content-center d-none d-lg-block">
					<h4 className="price">$NT{'1000'}</h4>
				</div>

				<div className="col d-lg-none align-content-center">
					<h4 className="name">方磚起司蛋糕</h4>
					<h4 className="price">$NT{'1000'}</h4>
				</div>

				<div className="col col-lg-2 d-flex align-items-center">
					<input
						type="number"
						className="form form-control"
						value={quantity}
						onChange={(e) => {
							const qty = e.target.value;
							if (qty <= 0) {
								alert('觸發刪除此item');
								setQuantity(1);
								return;
							}
							setQuantity(e.target.value);
						}}
					/>
				</div>

				<div className="col-1 d-flex align-items-center">
					<div className="remove">❌</div>
				</div>
			</div>
		</div>
	);
}

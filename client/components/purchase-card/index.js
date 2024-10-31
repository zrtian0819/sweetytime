import React from 'react';
import Styles from '@/components/purchase-card/purchase.module.scss';
import Image from 'next/image';

export default function Purchase() {
	const shop = {
		shop_id: 1,
		name: '花磚甜點',
		logo_path: 'SYRUP_LESS_logo.png',
	};
	const product = {
		product_id: 1,
		name: '可麗露',
		file_name: '00_mosaicpastry_original.jpg',
	};

	return (
		<div className={`${Styles['TIL-Details']} p-3 d-flex flex-column gap-3`}>
			<div className="TIL-shop d-flex flex-row gap-2">
				<div className={Styles['TIL-ShopLogo']}>
					<Image
						src={`/photos/shop_logo/${shop.logo_path}`}
						alt={shop.name}
						width={50}
						height={50}
						className="w-100 h-100 object-fit-contain"
					/>
				</div>
				<p className="my-auto">{shop.name}</p>
			</div>

			<div className={`${Styles['TIL-product']} d-flex flex-row align-items-center`}>
				<div className={Styles['TIL-buyImage']}>
					<Image
						src={`/photos/products/${product.file_name}`}
						alt={product.name}
						width={50}
						height={50}
						className="w-100 h-100 object-fit-contain"
					/>
				</div>
				<div className="TIL-style d-flex flex-row w-100 justify-content-between px-3 px-sm-5">
					<div className="TIL-buyName my-auto">
						<h4>{product.name}</h4>
						<p className="m-0">x2</p>
					</div>
					<h4 className="m-0" style={{ lineHeight: '60px' }}>
						NT299
					</h4>
				</div>
			</div>

			<div className="d-flex flex-sm-row flex-column-reverse justify-content-between">
				<div className="mt-2">
					<h4 className="m-0">備註:</h4>
					<h4 className="my-auto" style={{ color: '#7caec8' }}>
						已使用的優惠：
						<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
							滿千折百
						</span>
					</h4>
				</div>

				<div className="d-flex flex-column justify-content-center align-items-start align-items-sm-end">
					<div className={`${Styles['order-label']} d-flex justify-content-end`}>
						<label htmlFor="order-total">小計:</label>
						<div className="d-flex flex-row gap-2">
							<span>NT$</span>
							<del id="order-total" className={`${Styles['TIL-priceBox']} m-0`}>
								1794
							</del>
						</div>
					</div>

					<div className={`${Styles['order-label']} d-flex justify-content-end`}>
						<label htmlFor="discounted-total">折扣後金額:</label>
						<div className="d-flex flex-row gap-2">
							<span>NT$</span>
							<h3
								id="discounted-total"
								className={`${Styles['TIL-price-discounted']} ${Styles['TIL-priceBox']} m-0`}
							>
								1694
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

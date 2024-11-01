import React, { useState } from 'react';
import Styles from '@/components/purchase-card/purchase.module.scss';
import Image from 'next/image';
import { Modal, Button } from 'react-bootstrap';

export default function Window() {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// 暫時的假資料，欄位名稱請依資料庫為準
	const shop = {
		shop_id: 1,
		name: '花磚甜點',
		logo_path: 'SYRUP_LESS_logo.png',
	};
	const product = {
		product_id: 1,
		name: '可麗露',
		file_name: '00_mosaicpastry_original.jpg',
		price: 299,
		quantity: 2,
	};
	const order = {
		orderNumber: '24071870987771',
		status: '已完成',
		coupon_name: '滿千折百',
		that_time_price: 1694,
		paymentMethod: '信用卡',
		order_time: '2024-07-18 09:08:11',
	};

	return (
		<>
			<Button
				variant=""
				className="btn my-auto"
				style={{ color: '#fe867f' }}
				onClick={handleShow}
			>
				查看明細
			</Button>

			<Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-centered">
				<Modal.Header closeButton>
					<Modal.Title>訂單明細</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<OrderDetails order={order} />
					<div className="d-flex flex-column gap-3">
						<ProductItem product={product} />
						<ProductItem product={product} />
						<ProductItem product={product} />
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						關閉
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

function OrderDetails({ order }) {
	return (
		<div className="TIL-detail">
			<p>
				訂單編號：<span>{order.orderNumber}</span>
			</p>
			<p>
				訂單狀態：<span>{order.status}</span>
			</p>
			<p>
				使用優惠卷：
				<span style={{ textDecoration: 'underline' }}>{order.coupon_name}</span>
			</p>
			<p>
				訂單總額：<span>NT$ {order.that_time_price}</span>
			</p>
			<p>
				付費方式：<span>{order.paymentMethod}</span>
			</p>
			<p>
				訂單時間：<span>{order.order_time}</span>
			</p>
		</div>
	);
}

function ProductItem({ product }) {
	return (
		<div className={`${Styles['TIL-windowBody']} px-3 pb-3`}>
			<div className="d-flex flex-row align-items-center">
				<div className={Styles['TIL-WindowImage']}>
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
						<p className="m-0">x{product.quantity}</p>
					</div>
					<h4 className="m-0" style={{ lineHeight: '60px' }}>
						NT{product.price}
					</h4>
				</div>
			</div>
			<div className="d-flex flex-column justify-content-center align-items-start align-items-end">
				<div className={`${Styles['order-label']} d-flex justify-content-end gap-2`}>
					<label htmlFor="discounted-total">金額:</label>
					<div className="d-flex flex-row gap-2">
						<span>NT$</span>
						<h3
							id="discounted-total"
							className={`${Styles['TIL-price-discounted']} ${Styles['TIL-priceBox']} m-0`}
						>
							{product.price}
						</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

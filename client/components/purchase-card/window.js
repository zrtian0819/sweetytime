import React, { useState } from 'react';
import Styles from '@/components/purchase-card/purchase.module.scss';
import Image from 'next/image';
import { Modal, Button } from 'react-bootstrap';

export default function Window({ orderData }) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	if (!orderData) return null;

	// 計算訂單項目的總金額
	const calculateSubtotal = () => {
		if (!orderData.items || orderData.items.length === 0) return 0;

		return orderData.items.reduce((sum, item) => {
			return sum + (Number(item.that_time_price) || 0);
		}, 0);
	};

	// 計算折扣了多少錢
	const calculateDiscount = () => {
		return calculateSubtotal() - (Number(orderData.total_price))
	}

	// 計算total_price加上ship_pay
	const allSubtotal = () => {
		return Number(orderData.total_price) + Number(orderData.ship_pay);
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
					<OrderDetails order={orderData} />
					<div className="d-flex flex-column gap-3">
						{orderData.items &&
							orderData.items.map((item, index) => (
								<ProductItem key={item.id || index} product={item} />
							))}
					</div>
					{/* 總金額 */}
					<div className="d-flex flex-column justify-content-end align-items-end mt-3 gap-2">
						<div className="w-100 d-flex justify-content-between">
							<h4 className="m-0 h5">小計</h4>
							<h4 className="m-0 h5 text-end"> NT$ {calculateSubtotal()}</h4>
						</div>
						<div className="w-100 d-flex justify-content-between">
							<h4 className="m-0 h5">運費</h4>
							<h4 className="m-0 h5 text-end"> NT$ {orderData.ship_pay}</h4>
						</div>
						<div className="w-100 d-flex justify-content-between">
							<h4 className="m-0 h5">已折優惠</h4>
							<h4 className="m-0 h5 text-end text-primary">- NT$ {calculateDiscount()}</h4>
						</div>
						<div className="w-100 d-flex justify-content-between">
							<h4 className="m-0 h4">款項</h4>
							<h4 className="m-0 h4 text-end"> NT$ {allSubtotal()}</h4>
						</div>
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
	const formatDateTime = (dateTimeStr) => {
		try {
			const date = new Date(dateTimeStr);
			return date.toLocaleString('zh-TW', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			});
		} catch (error) {
			console.error('Date formatting error:', error);
			return dateTimeStr;
		}
	};

	const getStatusBadgeClass = (status) => {
		switch (status) {
			case '運送中':
				return 'bg-info';
			case '進行中':
				return 'bg-warning';
			case '已完成':
				return 'bg-success';
			default:
				return 'bg-secondary';
		}
	};

	return (
		<div className="TIL-detail">
			<div className="border-bottom pb-3 mb-3">
				<p className="mb-2">
					訂單編號：<span>{order.id}</span>
				</p>
				<p className="mb-2">
					訂單狀態：
					<span
						className={`badge ${getStatusBadgeClass(order.status)} ms-2 px-3 py-2`}
						style={{ fontSize: '1rem' }}
					>
						{order.status}
					</span>
				</p>
				<p className="mb-2">
					使用優惠卷：
					<span style={{ textDecoration: 'underline' }}>
						{order.coupon_name || '未使用優惠'}
					</span>
				</p>
				<p className="mb-2">
					付費方式：<span>{order.payment}</span>
				</p>
				<p className="mb-2">
					訂單時間：<span>{formatDateTime(order.order_time)}</span>
				</p>
			</div>

			<div>
				<p className="mb-2">
					收件人：<span>{order.delivery_name}</span>
				</p>
				<p className="mb-2">
					聯絡電話：<span>{order.delivery_phone}</span>
				</p>
				<p className="mb-2">
					寄送方式 : <span>{order.delivery_type}</span>
				</p>
				<p className="mb-2">
					收件地址：<span>{order.delivery_address}</span>
				</p>
			</div>
		</div>
	);
}

function ProductItem({ product }) {
	console.log('ProductItem received:', {
		product,
		id: product.id,
		productId: product.product_id,
		photoName: product.photo_name,
		productName: product.product_name,
	});

	const product_price = product.that_time_price / product.amount;
	return (
		<div className={`${Styles['TIL-windowBody']} p-3`}>
			<div className="d-flex align-items-center">
				<Image
					src={`/photos/products/${product.photo_name || 'default.png'}`}
					alt="商品圖片"
					width={100}
					height={100}
					onError={(e) => {
						e.target.src = '/photos/products/default.jpg';
					}}
				/>
			</div>
			<div className="w-100">
				<div className="d-flex flex-row align-items-center">
					<div className="d-flex flex-row pt-2 px-2 px-sm-4">
						<div className="my-auto">
							<h4>{product.product_name || `商品 #${product.product_id}`}</h4>
							<h4>
								NT$ {product_price} x {product.amount}
							</h4>
						</div>
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
								{product.that_time_price}
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

import React, { useState, useEffect } from 'react';
import sty from './delivery.module.scss';

export default function DeliveryModal({ deliveryAry = [], setShowShip, setCurrentShip }) {
	console.log(deliveryAry);
	return (
		<>
			<div className={`${sty['bg']}`}>
				<div className={`${sty['deliveryBox']}`}>
					<div
						className={`${sty['ZRT-btn-close']} ZRT-click`}
						onClick={() => {
							setShowShip(false);
						}}
					>
						×
					</div>
					<h2 className="text-center mb-4">常用地址</h2>
					<div className={`${sty['addressBox']}`}>
						<div className={`${sty['userAdress']} container-fluid`}>
							<div className="row mb-2">
								<h3 className="col-3">收件人姓名</h3>
								<h3 className="col-3">收件人電話</h3>
								<h3 className="col-6">寄件地址</h3>
							</div>
							{deliveryAry &&
								deliveryAry.map((info) => {
									return (
										<div
											className={`${sty['address']} row mb-3`}
											onClick={() => {
												console.log('會被往上傳:', info);
												setCurrentShip(info);
												setShowShip(false);
											}}
										>
											<div className="col-3">{info.name}</div>
											<div className="col-3">{info.phone}</div>
											<div className="col-6">{info.address}</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.bg {
					position: fixed;
					top: 0;
					left: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100vw;
					height: 100vh;
					background-color: rgba(0, 0, 0, 0.3);
				}
				.ZRT-btn-close {
					position: absolute;
					top: 15px;
					right: 25px;
					font-size: 40px;
					color: gray;
				}
				.deliveryBox {
					width: 600px;
					min-height: 300px;
					max-height: 80vh;
					background-color: white;
					border-radius: 20px;
					z-index: 10;
					padding: 30px;

					position: relative;
				}
				.addressBox {
					 {
						/* background-color: #ccc; */
					}
				}

				@media (max-width: 768px) {
					.deliveryBox {
						width: 90%;
					}
				}
			`}</style>
		</>
	);
}

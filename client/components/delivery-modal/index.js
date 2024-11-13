import React, { useState, useEffect } from 'react';
import sty from './delivery.module.scss';

export default function DeliveryModal({ deliveryAry = [], setShowShip, setCurrentShip }) {
	// console.log(deliveryAry);
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
											key={info.id}
											className={`${sty['address']} row mb-3`}
											onClick={() => {
												setCurrentShip({ ...info, timeStamp: Date.now() });
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
		</>
	);
}

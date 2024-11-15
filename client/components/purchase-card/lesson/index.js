import React from 'react';
import Styles from '@/components/purchase-card/purchase.module.scss';
import Link from 'next/link';

const PurchaseCard = ({
	id,
	order_id,
	lesson_id,
	sign_up_time,
	canceled_time,
	order_info,
	transaction_id,
}) => {
	let orderInfo;
	try {
		orderInfo = JSON.parse(order_info || '{}');
	} catch (error) {
		console.error('Error parsing order_info:', error);
		orderInfo = {};
	}

	const courseInfo = orderInfo.packages?.[0]?.products?.[0] || {};

	return (
		<div className={`${Styles['TIL-Details']} p-3 d-flex flex-column`}>
			{/* 訂單編號 */}
			<p className="text-start mb-3">
				訂單編號: <span>{order_id}</span>
			</p>

			<div className="d-flex flex-column justify-content-between">
				{/* 課程資訊區塊 */}
				<div className="d-flex flex-sm-row flex-column justify-content-between mb-3">
					<div>
						<h4 className="m-0">課程資訊:</h4>
						<Link
							href={`/lesson/${lesson_id}`}
							className={`${Styles['course-link']} my-2`}
							style={{
								color: '#7caec8',
								textDecoration: 'none',
								transition: 'color 0.3s ease',
							}}
						>
							<h3 className="my-2 course-name">{courseInfo.name || '未知課程'}</h3>
						</Link>
					</div>

					{/* 價格資訊 */}
					<div className="d-flex flex-column justify-content-end align-items-start align-items-sm-end">
						<div className={`${Styles['order-label']} d-flex justify-content-end`}>
							<label>課程費用:</label>
							<div className="d-flex flex-row gap-2">
								<span>NT$</span>
								<h3
									className={`${Styles['TIL-price-discounted']} ${Styles['TIL-priceBox']} m-0`}
								>
									{courseInfo.price?.toLocaleString() || '0'}
								</h3>
							</div>
						</div>
					</div>
				</div>

				{/* 報名時間 */}
				<div className="d-flex justify-content-between text-secondary">
					<p className="text-secondary mb-0">
						上課時間：
						{courseInfo.time
							? new Date(courseInfo.time).toLocaleString('zh-TW', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
							  })
							: '時間未定'}
					</p>
					<p className="text-secondary mb-0">
						報名時間：{new Date(sign_up_time).toLocaleString('zh-TW')}
					</p>
				</div>
			</div>
		</div>
	);
};

export default PurchaseCard;

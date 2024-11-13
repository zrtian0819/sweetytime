import React from 'react';
import { toast } from 'react-hot-toast';

// 自訂的訊息結構
export function CustomToastMessage({ title, description }) {
	return (
		<>
			<div style={{ color: '#fff' }}>
				<strong>{title}</strong>
				<p style={{ margin: '0px' }}>{description}</p>
			</div>
		</>
	);
}

// 輔助函數，用於顯示不同類型的通知與自定義樣式
export function showCustomToast(type, title, description) {
	const content = <CustomToastMessage title={title} description={description} />;
	const locationOptions = {
		duration: 3000,
		position: 'bottom-right',
		style: {
			width: '280px',
			height: '80px',
			background: '#fe6f67',
		},
	};

	const toastFunction = type === 'add' ? toast.success : toast.error;
	toastFunction(content, locationOptions);
}

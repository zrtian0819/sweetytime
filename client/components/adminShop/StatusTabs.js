import React from 'react';
import styles from '@/styles/adminShop.module.scss';

export default function StatusTabs({ selectedStatus, setSelectedStatus }) {
	return (
		<div className={styles.statusTabs}>
			<button
				onClick={() => setSelectedStatus('全部')}
				className={selectedStatus === '全部' ? styles.activeTab : ''}
			>
				全部
			</button>
			<button
				onClick={() => setSelectedStatus('營業中')}
				className={selectedStatus === '營業中' ? styles.activeTab : ''}
			>
				營業中
			</button>
			<button
				onClick={() => setSelectedStatus('已下架')}
				className={selectedStatus === '已下架' ? styles.activeTab : ''}
			>
				已下架
			</button>
		</div>
	);
}

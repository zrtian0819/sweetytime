import React from 'react';
import styles from '@/components/button/style.module.scss';
import { IoMdAdd } from 'react-icons/io';

export default function AddButton({ value }) {
	return (
		<>
			<div className={styles['add-button']}>
				<IoMdAdd className={styles['icon']} />
				<span className={styles['button-text']}>{value}</span>
			</div>
		</>
	);
}

import React from 'react';
import Link from 'next/link';
import AddButton from '@/components/button/add-button';
import styles from '@/components/adminCRUD/buttonStyles.module.scss';

export default function Add({ href='' }) {
	return (
		<>
			<div className={styles.addButton}>
				<Link href={href}>
					<AddButton value="新增" />
				</Link>
			</div>
		</>
	);
}

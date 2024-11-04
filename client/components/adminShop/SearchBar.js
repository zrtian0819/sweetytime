import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '@/styles/adminShop.module.scss';

export default function SearchBar({ searchShop, setsearchShop }) {
	return (
		<div className={styles.searchContainer}>
			<input
				type="text"
				placeholder="搜尋店家"
				value={searchShop}
				onChange={(e) => setsearchShop(e.target.value)}
				className={styles.searchInput}
			/>
			<button className={styles.searchButton}>
				<FaSearch size={25} style={{ color: 'white' }} />
			</button>
		</div>
	);
}

import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.scss';
import { TiDelete } from 'react-icons/ti';

const SearchBar = ({ keyword, onKeywordChange, onRecover, handleSearchChange, placeholder }) => {
	return (
		<div className={`${styles.searchBar} position-relative`}>
			<input
				type="text"
				value={keyword}
				onChange={(e) => onKeywordChange(e.target.value)}
				placeholder={placeholder}
				className={styles.formControl}
			/>
			<button
				className={`${styles.clearBtn} position-absolute`}
				style={{ top: '5px', right: '50px' }}
				onClick={onRecover}
			>
				<TiDelete size={25} />
			</button>
			<button type="button" className={styles.btnCustom} onClick={handleSearchChange}>
				<FaSearch className={styles.searchIcon} />
			</button>
		</div>
	);
};

export default SearchBar;

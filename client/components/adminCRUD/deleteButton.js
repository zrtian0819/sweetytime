import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import styles from './buttonStyles.module.scss';

const DelButton = ({ onClick }) => {
	return (
		<button className={styles.delButton} onClick={onClick}>
			<FaTrashAlt />
		</button>
	);
};

export default DelButton;

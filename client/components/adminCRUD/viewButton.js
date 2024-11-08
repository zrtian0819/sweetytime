// components/ViewButton.js
import React from 'react';
import { FaEye } from 'react-icons/fa';
import styles from './buttonStyles.module.scss';

const ViewButton = ({ onClick }) => {
  return (
    <button className={styles.viewButton} onClick={onClick}>
      <FaEye />
    </button>
  );
};

export default ViewButton;

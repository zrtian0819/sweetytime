import React from 'react';
import styles from './button.module.scss';

const CustomButton = ({ text, onClick }) => (
  <button className={styles.customFileUpload} onClick={onClick}>
    {text}
  </button>
);

export default CustomButton;

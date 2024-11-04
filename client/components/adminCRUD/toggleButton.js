// components/adminCrudBtn/ToggleButton.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './buttonStyles.module.scss';

const ToggleButton = ({ isActive, onClick }) => {
  return (
    <div className={styles.toggleContainer} onClick={onClick}>
      <div className={`${styles.toggleSwitch} ${isActive ? styles.active : ''}`}>
        <div className={styles.toggleCircle}></div>
      </div>
      <span className={styles.toggleLabel}>{isActive ? '啟用' : '停用'}</span>
    </div>
  );
};

ToggleButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ToggleButton;

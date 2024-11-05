// components/EditButton.js
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import styles from './buttonStyles.module.scss';

const EditButton = ({ onClick }) => {
  return (
    <button className={styles.editButton} onClick={onClick}>
      <FaEdit />
    </button>
  );
};

export default EditButton;

import React from 'react';
import styles from '../button/style.module.scss';
import { FaArrowLeft } from 'react-icons/fa6';

export default function ExpandableButton({
  value = '返回師資列表',
}) {
  return (
    <>
      <div className={styles["expandable-button"]}>
        <FaArrowLeft className={styles["icon"]} />
        <span className={styles["button-text"]}>{value}</span>
      </div>

    </>
  );
}

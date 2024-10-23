// /components/TeacherCard/index.js
import React from 'react';
import styles from './teacher-card.module.scss';

const TeacherCard = ({ teacher }) => (
	<div className={styles.card}>
		<h3 className={styles.teacherTitle}>{teacher.title}</h3>
		<h3 className={styles.teacherName}>{teacher.name}</h3>
		<div className={styles.imgBox}>
			<img src={teacher.imgSrc} alt={teacher.name} className={styles.teacherImage} />
		</div>
	</div>
);

export default TeacherCard;

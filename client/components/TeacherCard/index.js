import React from 'react';
import Link from 'next/link';
import styles from './teacher-card.module.scss';

const TeacherCard = ({ teacher }) => (
	<Link href={`/teacher/teacherDetail?id=${teacher.id}`} passHref>
		<div className={styles.card}>
			<h3 className={styles.teacherTitle}>{teacher.title}</h3>
			<h3 className={styles.teacherName}>{teacher.name}</h3>
			<div className={styles.imgBox}>
				<img src={`/photos/teachers/${teacher.img_path}`} alt={teacher.name} className={styles.teacherImage} />
			</div>
		</div>
	</Link>
);

export default TeacherCard;

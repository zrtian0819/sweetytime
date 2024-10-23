import React from 'react';
import Header from '@/components/header';
import Banner from '@/components/lesson/banner';
import LessonCard from '@/components/lesson/lesson-card';
import SmLesson from '@/components/lesson/small-lesson';
import Footer from '@/components/footer';
import styles from '@/styles/lesson.module.scss';

export default function Lesson() {
	return (
		<>
			<Header />
			<Banner />
			<div className="container mt-2 d-flex justify-content-evenly">
				<div className="card-group">
					<LessonCard />
					<LessonCard />
					<LessonCard />
				</div>
				<div className={`${styles['CTH-sm-lesson-box']}`}>
					<div className="text-center mb-3">即將開課</div>
					<SmLesson />
					<SmLesson />
					<SmLesson />
					<SmLesson />
					<SmLesson />
				</div>
			</div>
			<Footer />
		</>
	);
}

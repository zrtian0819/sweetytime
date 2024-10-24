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
			<Footer />
		</>
	);
}

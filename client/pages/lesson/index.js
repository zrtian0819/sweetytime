import React from 'react';
import Header from '@/components/header';
import Banner from '@/components/lesson/banner';
import LessonCard from '@/components/lesson/lesson-card';

export default function Lesson() {
	return (
		<>
			<Header />
			<Banner />
			<div className="container d-flex justify-content-evenly">
				<LessonCard />
				<LessonCard />
				<LessonCard />
			</div>
		</>
	);
}

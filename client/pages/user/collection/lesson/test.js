import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Test from '@/components/user-left';
import LessonCard from '@/components/lesson/lesson-card';
import Pagination from '@/components/pagination';
import Styles from '@/styles/userTest.module.scss';

export default function Lesson() {
	return (
		<>
			<Header />
			<div className={`${Styles['TIL-body']} container`}>
				<div className={`${Styles['TIL-userbody']} d-flex flex-column flex-md-row`}>
					<Test />
					<div className={`${Styles['TIL-user-right']} `}>
						<div className="d-flex flex-row flex-wrap justify-content-center">
							<LessonCard />
							<LessonCard />
							<LessonCard />
							<LessonCard />
							<LessonCard />
							<LessonCard />
						</div>
						<div className="m-auto">
							<Pagination
								currentPage={1}
								totalPages={5}
								onPageChange={() => {}}
								changeColor="#fe6f67"
							/>
						</div>
					</div>
				</div>
			</div>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}

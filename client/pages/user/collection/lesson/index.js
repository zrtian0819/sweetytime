import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
// import Styles from '@/styles/user.module.scss';
import UserBox from '@/components/user/userBox';
import LessonCard from '@/components/lesson/lesson-card';
import Pagination from '@/components/pagination';

export default function Lesson() {
	return (
		<>
			<Header />
			<UserBox>
				<div className="d-flex flex-row flex-wrap justify-content-center">
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
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}

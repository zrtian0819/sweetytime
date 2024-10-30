import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import LessonCard from '@/components/lesson/lesson-card';
import Pagination from '@/components/pagination';

export default function Lesson() {
	return (
		<>
			<Header />
			<UserBox>
				{/* 此頁面再自己修整 */}
				<div className="d-flex flex-column py-5 p-md-0 gap-3">
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
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import LessonCard from '@/components/lesson/lesson-card';
import Pagination from '@/components/pagination';

export default function Lessons(props) {
	return (
		<>
			<AdminLayout>
				<div className="d-flex flex-wrap">
					<LessonCard />
					<LessonCard />
					<LessonCard />
					<LessonCard />
					<LessonCard />
					<LessonCard />
					<LessonCard />
					<LessonCard />
					<LessonCard />
				</div>
				<Pagination
					currentPage={1}
					totalPages={5}
					onPageChange={() => {}}
					changeColor="#fe6f67"
				/>
			</AdminLayout>
		</>
	);
}

import React, { useState } from 'react';
import TeacherStyles from '@/styles/teacher.module.scss';
import Header from '@/components/header';
import TeacherCard from '@/components/TeacherCard';
import Footer from '@/components/footer';
import Pagination from '@/components/pagination';
import TeacherSidebar from '@/components/teacherSidebar';

const teachers = [
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '王美姬 Maggie', imgSrc: '/photos/teachers/Maggie.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' },
	{ id: 1, name: '劉偉苓 Willin', imgSrc: '/photos/teachers/00_willin.png' }

];

const ITEMS_PER_PAGE = 10; // 每頁顯示的卡片數量

export default function TeacherPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// 計算當前頁顯示的教師卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const teachersToShow = teachers.slice(startIndex, endIndex);

	// 計算總頁數
	const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);

	return (
		<>
			<Header />
			<div className={`${TeacherStyles.teacherPage}`}>
				<TeacherSidebar />

				{/* 教師卡片列表 */}
				<div className={`${TeacherStyles.teacherGridContainer} container py-5`}>
					<div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 row-cols-xl-5 gy-5 px-2 px-sm-5">
						{teachersToShow.map((teacher) => (
							<div className={`col ${TeacherStyles.col}`} key={teacher.id}>
								<TeacherCard teacher={teacher} />
							</div>
						))}
					</div>

					{/* 分頁元件置中 */}
					<div className="d-flex justify-content-center">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={(page) => setCurrentPage(page)}
							changeColor="white"
						/>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

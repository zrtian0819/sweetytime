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
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' },
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' },
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' },
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' },
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' },
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' },
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' },
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' }, 
    { id: 1, name: '施易男', imgSrc: '/photos/teachers/shiinan.png' }
	// ...其餘教師資料
];

const ITEMS_PER_PAGE = 10; // 每頁顯示的卡片數量

export default function TeacherPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [currentPageTeachers, setCurrentPageTeachers] = useState(teachers.slice(0, ITEMS_PER_PAGE));

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// 更新顯示的教師資料，根據 Pagination 傳回的頁碼
	const handlePageChange = (page) => {
		const startIndex = (page - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		setCurrentPageTeachers(teachers.slice(startIndex, endIndex));
	};

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
						{currentPageTeachers.map((teacher) => (
							<div className={`col ${TeacherStyles.col}`} key={teacher.id}>
								<TeacherCard teacher={teacher} />
							</div>
						))}
					</div>

					{/* 分頁元件置中 */}
					<div className="d-flex justify-content-center">
						<Pagination
							totalPages={totalPages}
							onPageChange={handlePageChange} // 傳入處理頁碼變更的函數
							changeColor="white"
						/>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

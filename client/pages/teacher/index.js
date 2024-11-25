import React, { useEffect, useState } from 'react';
import TeacherStyles from '@/styles/teacher.module.scss';
import Header from '@/components/header';
import TeacherCard from '@/components/TeacherCard';
import Footer from '@/components/footer';
import Pagination from '@/components/pagination';
import TeacherSidebar from '@/components/teacherSidebar';
import axios from 'axios';

const ITEMS_PER_PAGE = 10; // 每頁顯示的卡片數量

export default function TeacherPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [teachers, setTeachers] = useState([]);

	// 計算當前頁顯示的教師卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const teachersToShow = teachers.slice(startIndex, endIndex);

	// 計算總頁數
	const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);

	// 初次載入時獲取所有教師資料
	useEffect(() => {
		fetchTeachers();
	}, []);

	// 獲取教師資料，允許傳入搜尋參數
	const fetchTeachers = (searchParams = {}) => {
		axios
			.get('http://localhost:3005/api/teacher', { params: searchParams })
			.then((res) => {
				const validTeacher = res.data.filter((tc) => tc.activation == 1);   //將被停用的老師篩除
				setTeachers(validTeacher);
				setCurrentPage(1); // 當篩選條件變更時重置到第一頁
			})
			.catch((error) => console.log(error));
	};

	return (
		<>
			<Header />
			<div className={`${TeacherStyles.teacherPage}`}>
				<TeacherSidebar fetchTeachers={fetchTeachers} />
				<h3 className={`${TeacherStyles.title} mt-3`}>Popular Baking Experts</h3>

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
							onPageChange={(page) => setCurrentPage(page)} // 僅更新頁碼
							changeColor="#fe6f67"
						/>
					</div>
				</div>
			</div>
			<Footer bgColor="#FFC5BF" />
		</>
	);
}

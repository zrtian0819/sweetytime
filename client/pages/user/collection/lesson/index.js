import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import LessonCard from '@/components/collection/lesson-card';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';
import { FaSearch } from 'react-icons/fa';
import { withAuth } from '@/components/auth/withAuth';
import axios from 'axios';

function UserLesson() {
	const [lessons, setLessons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');

	// 獲取課程數據
	const fetchLessons = async (page, search = '') => {
		const token = localStorage.getItem('accessToken');
		try {
			setLoading(true);
			const token = localStorage.getItem('accessToken');
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/lesson`,
				{
					params: {
						page,
						search,
						limit: 6, // 每頁顯示6個課程
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('API 回應原始資料:', response.data);
			let lessonData;
			if (Array.isArray(response.data.data)) {
				lessonData = response.data.data;
			} else if (Array.isArray(response.data.lessons)) {
				lessonData = response.data.lessons;
			} else {
				console.error('無法解析課程資料，API 回應:', response.data);
				lessonData = [];
			}
			console.log('處理後的課程資料:', lessonData); // 記錄處理後的課程資料

			const totalPagesData =
				response.data.totalPages || Math.ceil(lessonData.length / 6) || 1;
			console.log('總頁數:', totalPagesData); // 記錄總頁數

			setLessons(lessonData);
			setTotalPages(totalPagesData);
			setError(null);
		} catch (err) {
			console.error('錯誤詳情:', err.response || err);
			setError('無法載入課程數據');
		} finally {
			setLoading(false);
		}
	};

	// 初始載入和頁面變化時獲取數據
	useEffect(() => {
		fetchLessons(currentPage, searchTerm);
	}, [currentPage]);

	// 處理搜索
	const handleSearch = (e) => {
		e.preventDefault();
		setCurrentPage(1); // 重置到第一頁
		fetchLessons(1, searchTerm);
	};

	// 處理分頁變化
	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo(0, 0); // 回到頁面頂部
	};

	if (loading) {
		return (
			<>
				<Header />
				<UserBox>
					<div className="text-center py-5">載入中...</div>
				</UserBox>
				<Footer bgColor="#fcf3ea" />
			</>
		);
	}

	return (
		<>
			<Header />
			<UserBox>
				<div className="d-flex flex-column py-5 p-md-0 gap-3">
					<form
						className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}
						onSubmit={handleSearch}
					>
						<input
							type="text"
							className="px-3"
							placeholder="透過課程名稱搜尋"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button type="submit" className={`${Styles['TIL-Btn']} btn p-0`}>
							<FaSearch size={25} className={Styles['TIL-Fa']} />
						</button>
					</form>

					{loading && <div className="text-center">載入中...</div>}

					{error && <div className="text-center text-danger">{error}</div>}

					<div className="d-flex flex-row flex-wrap justify-content-center">
						{lessons.map((lesson) => {
							console.log('正在傳遞的課程資料:', lesson);
							return <LessonCard key={lesson.id} lessonData={lesson} />;
						})}
					</div>

					{!loading && lessons.length === 0 && (
						<div className="text-center">沒有找到相關課程</div>
					)}

					{lessons.length > 0 && (
						<div className="m-auto">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								changeColor="#fe6f67"
							/>
						</div>
					)}
				</div>
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}

export default withAuth(UserLesson);

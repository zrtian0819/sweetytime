import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import CollectionCard from '@/components/user/collection/CollectionCard';
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

    const handleRemoveCollection = (deletedId) => {
        setLessons(prev => prev.filter(lesson => lesson.id !== deletedId));
    };

	return (
        <>
            <Header />
            <UserBox>
                <div className="d-flex flex-column py-5 p-md-0 gap-3">
                    <div className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}>
                        <input 
                            type="text" 
                            className="px-3" 
                            placeholder="透過課程名稱搜尋"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button 
                            className={`${Styles['TIL-Btn']} btn p-0`}
                            onClick={handleSearch}
                        >
                            <FaSearch size={25} className={Styles['TIL-Fa']} />
                        </button>
                    </div>
                    <div className="d-flex flex-row flex-wrap justify-content-center gap-5">
                        {loading ? (
                            <div>載入中...</div>
                        ) : error ? (
                            <div>{error}</div>
                        ) : lessons.length === 0 ? (
                            <div>沒有找到課程</div>
                        ) : (
                            lessons.map((lesson) => (
                                <CollectionCard
                                    key={lesson.id}
                                    type="lesson"
                                    data={lesson}
                                    onRemove={handleRemoveCollection}
                                />
                            ))
                        )}
                    </div>
                    <div className="m-auto">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            changeColor="#fe6f67"
                        />
                    </div>
                </div>
            </UserBox>
            <Footer bgColor="#fcf3ea" />
        </>
	);
}

export default withAuth(UserLesson);

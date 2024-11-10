import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import AdminTab from '@/components/adminTab';
import AdminSearch from '@/components/adminSearch';
import AddButton from '@/components/adminCRUD/addButton';
import Pagination from '@/components/pagination';
import styles from '@/styles/adminNews.module.scss';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import DelButton from '@/components/adminCRUD/deleteButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import SwalDetails from '@/components/news/swalDetails';
import axios from 'axios';
import 'animate.css';

export default function AdminNews(props) {
	const [news, setNews] = useState([]);
	const [filteredNews, setFilteredNews] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState('all');
	const [selectedNews, setSelectedNews] = useState(null);
	const [keyword, setKeyWord] = useState('');
	const [clearBtn, setClearBtn] = useState(false);

	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'open', label: '已上架文章' },
		{ key: 'close', label: '未上架文章' },
	];

	// 計算當前頁顯示的卡片範圍
	const ITEMS_PER_PAGE = 10;
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const newsToshow = filteredNews.slice(startIndex, endIndex);
	// 計算總頁數
	const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

	//上下架 & 篩選
	const handleToggleClick = (newsId) => {
		axios
			.post(`http://localhost:3005/api/news/admin/${newsId}`)
			.then((res) =>
				setNews((news) =>
					news.map((course) =>
						course.id === newsId ? { ...course, activation: res.data } : course
					)
				)
			)
			.catch((error) => console.error('更新失敗', error));
	};
	const filterNews = () => {
		// 初始化篩選結果
		let filteredResults = news;
		// 根據 status 進行篩選
		if (status === 'open') {
			filteredResults = filteredResults.filter((course) => course.activation == 1);
		} else if (status === 'close') {
			filteredResults = filteredResults.filter((course) => course.activation == 0);
		}

		// 根據 keyword 進行篩選
		if (keyword) {
			filteredResults = filteredResults.filter((course) => course.content.includes(keyword));
		}

		setFilteredNews(filteredResults);

		if (filteredResults.length < 1) {
			setCurrentPage(1);
		}
	};

	// 初次加載時從 API 獲取資料
	useEffect(() => {
		axios
			.get('http://localhost:3005/api/news/admin')
			.then((res) => setNews(res.data))
			.catch((error) => console.error('資料加載失敗', error));
	}, []);

	// 狀態
	useEffect(() => {
		setCurrentPage(1);
	}, [status]);

	useEffect(() => {
		filterNews();
	}, [status, news]);

	const onRecover = () => {
		setKeyWord('');
		setClearBtn(false);
		setFilteredNews(news);
	};

	const handleKeywordChange = (newKeyword) => {
		setKeyWord(newKeyword);
		setClearBtn(newKeyword.length > 0);
	};
	const handleSearchBtn = () => {
		filterNews();
	};

	// 詳細情形
	const handleViewClick = (news) => {
		setSelectedNews(news);
	};

	return (
		<AdminLayout>
			{/* 狀態列 */}
			<div className="d-flex justify-content-lg-between">
				<AdminSearch
					keyword={keyword}
					onKeywordChange={handleKeywordChange}
					handleSearchChange={handleSearchBtn}
					onRecover={clearBtn ? onRecover : null}
				/>
				<AddButton href={'/admin/News/createNews'} />
			</div>

			<AdminTab tabs={tabs} activeTab={status} setActiveTab={setStatus} />

			{/* 欄位內容 */}
			<table className={`${styles['LYT-table']} w-100`}>
				<thead className="text-center">
					<tr>
						<th className={`${styles['LYT-space']}`}>編號</th>
						<th className={`${styles['LYT-space']}`}>狀態</th>
						<th className={`${styles['LYT-title']}`}>標題</th>
						<th>內容</th>
						<th className={`${styles['LYT-space']}`}>分類</th>
						<th>建立時間</th>
						<th>更新狀態</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					{newsToshow.map((news) => (
						<tr key={news.id} className="text-center align-middle m-auto">
							<td className={`${styles['LYT-space']}`}>{news.id}</td>
							<td className={`${styles['LYT-space']}`}>
								{news.activation === 1 ? '上架中' : '未上架'}
							</td>
							<td className={`${styles['LYT-title']}`}>{news.title}</td>
							<td className={`${styles['LYT-content']}`}>
								{news.content.slice(0, 150) + '...'}
							</td>
							<td className={`${styles['LYT-space']}`}>{news.class_name}</td>
							<td className="p-2">{news.createdAt}</td>
							<td className="p-2">
								<ToggleButton
									onClick={() => handleToggleClick(news.id)}
									isActive={news.activation == 1}
								/>
							</td>
							<td>
								<div className="d-flex justify-content-center">
									<ViewButton onClick={() => handleViewClick(news)} />
									<Link href={`./News/editNews/${news.id}`}>
										<EditButton />
									</Link>
									<Link href={`./deleteNews`}>
										<DelButton />
									</Link>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* 分頁 */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => setCurrentPage(page)}
				changeColor="#fff"
			/>

			{/* 詳細資訊 */}
			{selectedNews && (
				<SwalDetails news={selectedNews} onClose={() => setSelectedNews(null)} />
			)}
		</AdminLayout>
	);
}

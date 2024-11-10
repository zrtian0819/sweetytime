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
import ToggleButton from '@/components/adminCRUD/toggleButton';
import SwalDetails from '@/components/news/swalDetails';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

export default function AdminNews(props) {
	const [news, setNews] = useState([]);
	const [filteredNews, setFilteredNews] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState('all');
	const [selectedNews, setSelectedNews] = useState(null);

	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'open', label: '已上架文章' },
		{ key: 'close', label: '未上架文章' },
	];

	// 初次加載時從 API 獲取資料
	useEffect(() => {
		axios
			.get('http://localhost:3005/api/news/admin')
			.then((res) => setNews(res.data))
			.catch((error) => console.error('資料加載失敗', error));
	}, []);

	// 計算當前頁顯示的卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const newsToshow = filteredNews.slice(startIndex, endIndex);

	// 計算總頁數
	const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

	//上下架 & 篩選
	const handleToggleClick = (newsId) => {
		axios
			.post(`http://localhost:3005/api/news/admin/${newsId}`)
			.then((res) => {
				const updatedStatus = res.data.activation;
				setNews((prevNews) =>
					prevNews.map((newsItem) =>
						newsItem.id === newsId
							? { ...newsItem, activation: updatedStatus }
							: newsItem
					)
				);
				filterNews();
			})
			.catch((error) => console.error('更新失敗', error));
	};

	const filterNews = () => {
		if (status === 'open') {
			setFilteredNews(news.filter((newsItem) => newsItem.activation === 1));
		} else if (status === 'close') {
			setFilteredNews(news.filter((newsItem) => newsItem.activation === 0));
		} else {
			setFilteredNews(news);
		}
		if (newsToshow.length === 1 && currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [status]);

	useEffect(() => {
		filterNews();
	}, [status, news]);

	const handleViewClick = (newsItem) => {
		setSelectedNews(newsItem);
	};

	return (
		<AdminLayout>
			{/* 狀態列 */}
			<div className="d-flex justify-content-lg-between">
				<AdminSearch />
				<AddButton href={'./admin/news/creatNews'} />
			</div>

			<AdminTab tabs={tabs} activeTab={status} setActiveTab={setStatus} />

			{/* 欄位內容 */}
			<table className={`${styles['LYT-table']} w-100`}>
				<thead className="text-center">
					<tr>
						<th>編號</th>
						<th>狀態</th>
						<th>標題</th>
						<th>內容</th>
						<th>分類</th>
						<th>建立時間</th>
						<th>更新狀態</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					{newsToshow.map((newsItem) => (
						<tr key={newsItem.id} className="text-center m-auto align-middle">
							<td>{newsItem.id}</td>
							<td>{newsItem.activation === 1 ? '上架中' : '未上架'}</td>
							<td>{newsItem.title}</td>
							<td>{newsItem.content.slice(0, 30) + '...'}</td>
							<td>{newsItem.class_name}</td>
							<td>{newsItem.createdAt}</td>
							<td>
								<ToggleButton
									onClick={() => handleToggleClick(newsItem.id)}
									isActive={newsItem.activation === 1}
								/>
							</td>
							<td>
								<div className="d-flex justify-content-center">
									<ViewButton onClick={() => handleViewClick(newsItem)} />
									<Link href={`./editNews`}>
										<EditButton />
									</Link>
									{/* 暫時多擺一個按鈕模擬刪除鍵 */}
									<Link href={`./editNews`}>
										<EditButton />
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

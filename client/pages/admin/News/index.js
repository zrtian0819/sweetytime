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
		{ key: 'close', label: '未上架課程' },
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
			<div className={`${styles['LYT-page']} mt-4`}>
				<div className={styles['LYT-nav']}>
					<div className="d-flex flex-row justify-content-between pe-3">
						<AdminSearch />
						<AddButton href={'./news/creatNews'} />
					</div>
					<AdminTab tabs={tabs} activeTab={status} setActiveTab={setStatus} />
				</div>
				{/* 欄位內容 */}
				<div className="container-fluid">
					<table className={`${styles['LYT-table']} `}>
						<thead className={`${styles['LYT-title']} text-center`}>
							<tr className={`${styles['LYT-row']} row`}>
								<th className="col-1">編號</th>
								<th className="col-1">狀態</th>
								<th className="col-2">標題</th>
								<th className="col-2">內容</th>
								<th className="col-1">分類</th>
								<th className="col-2">建立時間</th>
								<th className="col-1">更新狀態</th>
								<th className="col-2">操作</th>
							</tr>
						</thead>

						<tbody>
							{newsToshow.map((newsItem) => (
								<tr key={newsItem.id} className="row text-center p-1">
									<td
										className={`${styles['LYT-content']} col-1 p-1 
									`}
									>
										{newsItem.id}
									</td>
									<td className={`${styles['LYT-content']} col-1 p-1`}>
										{newsItem.activation === 1 ? '上架中' : '未上架'}
									</td>
									<td className={`${styles['LYT-content']} col-2 p-1`}>
										{newsItem.title}
									</td>
									<td className={`${styles['LYT-content']} col-2 p-1`}>
										{newsItem.content.slice(0, 30) + '...'}
									</td>
									<td className={`${styles['LYT-content']} col-1 p-1`}>
										{newsItem.class_name}
									</td>
									<td className={`${styles['LYT-content']} col-2`}>
										{newsItem.createdAt}
									</td>
									<td className={`${styles['LYT-content']} col-1`}>
										<ToggleButton
											onClick={() => handleToggleClick(newsItem.id)}
											isActive={newsItem.activation === 1}
										/>
									</td>
									<td className={`${styles['LYT-content']} col-2 p-1`}>
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
				</div>
				{/* 分頁 */}
				<div className={styles.paginationContainer}>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={(page) => setCurrentPage(page)}
						changeColor="#fff"
					/>
				</div>

				{/* 詳細資訊 */}
				{selectedNews && (
					<SwalDetails news={selectedNews} onClose={() => setSelectedNews(null)} />
				)}
			</div>
		</AdminLayout>
	);
}

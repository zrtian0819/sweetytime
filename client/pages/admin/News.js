import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import AdminTab from '@/components/adminTab';
import Pagination from '@/components/pagination';
import styles from '@/styles/adminNews.module.scss';
import SearchBar from '@/components/adminSearch';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import SwalDetails from '@/components/news/swalDetails';
// import SwalEdit from '@/components/news/swalEdit';

const dataNews = [
	{
		id: 1,
		title: '美味料理食譜：經典法式甜點！檸檬萊姆塔的酸甜滋味',
		content: '',
		imgSrc: '/photos/articles/lemonMeringueTart.jpg',
		category: '蛋糕',
		date: '2024-08-16 14:50',
		status: '上架中',
	},
	{
		id: 2,
		title: '餐桌心理學：為什麼明明吃很飽，還能塞得下甜點？',
		imgSrc: '/photos/articles/dessertStomach.jpg',
		category: '其他',
		date: '2024-08-16 15:08',
		status: '已下架',
	},
	{
		id: 3,
		title: '日本伴手禮生力軍：草莓甜點專賣店「Berry UP！」手感插畫包裝、限定版草莓大福超吸睛',
		imgSrc: '/photos/articles/Dinara Kasko.jpg',
		category: '蛋糕',
		date: '2024-08-16 15:30',
		status: '上架中',
	},
	{
		id: 4,
		title: '日本伴手禮生力軍：草莓甜點專賣店「Berry UP！」手感插畫包裝、限定版草莓大福超吸睛',
		imgSrc: '/photos/articles/Dinara Kasko.jpg',
		category: '蛋糕',
		date: '2024-08-16 15:30',
		status: '上架中',
	},
	{
		id: 5,
		title: '日本伴手禮生力軍：草莓甜點專賣店「Berry UP！」手感插畫包裝、限定版草莓大福超吸睛',
		imgSrc: '/photos/articles/Dinara Kasko.jpg',
		category: '蛋糕',
		date: '2024-08-16 15:30',
		status: '上架中',
	},
];

const ITEMS_PER_PAGE = 10;

const newsAdmin = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedNews, setSelectedNews] = useState(null); // 查看詳情
	const [editNews, setEditNews] = useState(null); // 編輯
	const [activeTab, setActiveTab] = useState('all');
	const [isToggled, setIsToggled] = useState(false); // 定義 isToggled 狀態

	const handleSearch = () => {
		console.log('搜尋按鈕被點擊');
	};
	// 狀態
	const handleToggleClick = () => {
		setIsToggled(!isToggled);
		console.log('Toggle狀態:', isToggled ? '關閉' : '開啟');
	};

	// 狀態列
	const tabs = [
		{ key: 'all', label: '全部', content: '所有文章' },
		{ key: 'active', label: '上架中', content: '目前上架中的文章' },
		{ key: 'inactive', label: '已下架', content: '目前已下架的文章' },
	];

	// 搜尋篩選
	const filteredNews = dataNews.filter((news) => {
		const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
		if (activeTab === 'all') return matchesSearch;
		if (activeTab === 'active') return matchesSearch && news.status === '上架中';
		if (activeTab === 'inactive') return matchesSearch && news.status === '已下架';
		return matchesSearch;
	});

	const handleViewClick = (news) => {
		setSelectedNews(news);
	};

	const handleEditClick = (news) => {
		setEditNews(news);
	};
	const handleSaveEdit = (updatedNews) => {
		// 在此處更新你的資料，例如發送 API 請求
		console.log('儲存的修改資料：', updatedNews);
		MySwal.close();
	};

	// 分頁
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

	return (
		<AdminLayout>
			<div className={styles.newsPage}>
				{/* 搜尋 */}
				<SearchBar onSearch={handleSearch} />

				{/* 狀態列 */}
				<AdminTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

				{/* 新增按鈕 */}
				<Link href="./addNews">
					<button className={styles.addButton}>新增文章</button>
				</Link>

				{/* 欄位內容 */}
				<table className={styles.newsTable}>
					<thead>
						<tr>
							<th>文章編號</th>
							<th>狀態</th>
							<th>文章標題</th>
							<th>文章分類</th>
							<th>建立時間</th>
							<th>詳細資訊</th>
							<th>編輯資料</th>
							<th>更新狀態</th>
						</tr>
					</thead>
					<tbody>
						{currentNews.map((news) => (
							<tr>
								<td>{news.id}</td>
								<td>{news.title}</td>
								<td>{news.status}</td>
								<td>{news.category}</td>
								<td>{news.date}</td>
								<td>
									<div className="d-flex justify-content-center">
										<ViewButton
											href={`./viewNews`}
											onClick={() => handleViewClick(news)}
										/>
									</div>
								</td>
								<td>
									<div className="d-flex justify-content-center">
										<div className="d-flex justify-content-center">
											{/* <EditButton onClick={() => handleEditClick(news)} /> */}
											<Link href={`./editNews`}>
												<EditButton />
											</Link>
										</div>
									</div>
								</td>

								{/* 更新狀態 */}
								<td>
									<div className="d-flex justify-content-center">
										<ToggleButton
											onClick={handleToggleClick}
											isActive={isToggled}
										/>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

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

				{/* 編輯視窗 */}
				{editNews && (
					<SwalEdit
						news={editNews}
						onSave={handleSaveEdit}
						onClose={() => setEditNews(null)} // 點擊外部關閉
					/>
				)}
			</div>
		</AdminLayout>
	);
};

export default newsAdmin;

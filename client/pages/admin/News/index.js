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
import Swal from 'sweetalert2';
import axios from 'axios';

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
	const ITEMS_PER_PAGE = 6;
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

	const handleDeleteClick = (newsId) => {
		const swalBtn = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success ms-2',
				cancelButton: 'btn btn-danger',
			},
			buttonsStyling: false,
		});
		swalBtn
			.fire({
				title: '真的要刪除嗎?',
				text: '刪除後無法復原喔! ｡ﾟ( ﾟஇωஇﾟ)ﾟ｡',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: '我確定',
				cancelButtonText: '不要好了',
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					axios
						.delete(`http://localhost:3005/api/news/admin/del/${newsId}`)
						.then((res) => {
							swalBtn.fire('刪除成功', '這篇文章掰掰了‧⁺◟( ᵒ̴̶̷̥́ ·̫ ᵒ̴̶̷̣̥̀ )', 'success');
							setNews(news.filter((item) => item.id !== newsId)); // 更新 news 狀態
						})
						.catch((error) => {
							console.error('刪除失敗', error);
							swalBtn.fire('刪除失敗', '請再試一次', 'error');
						});
				}
			});
	};

	// 去除p標籤
	const sanitizeContent = (content) => {
		// 去除空的 <p></p> 標籤
		const sanitizedContent = content.replace(/<p>(\s|&nbsp;)*<\/p>/g, '');
		// 限制字數為 150 字
		return sanitizedContent.length > 100
			? sanitizedContent.slice(0, 100) + '...'
			: sanitizedContent;
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
						<th className={`${styles['LYT-space']} mx-5`}>狀態</th>
						<th>標題</th>
						<th className={`${styles['LYT-Tcontent']}`}>內容</th>
						<th>分類</th>
						<th>建立時間</th>
						<th>更新狀態</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					{newsToshow.map((news) => (
						<tr key={news.id} className="text-center align-middle m-auto">
							<td className={`${styles['LYT-space']}`}>{news.id}</td>
							<td className={`${styles['LYT-space']} mx-4`}>
								{news.activation === 1 ? '上架中' : '未上架'}
							</td>
							<td className={`${styles['LYT-title']}`}>{news.title}</td>
							<td
								className={`${styles['LYT-content']}`}
								dangerouslySetInnerHTML={{ __html: sanitizeContent(news.content) }}
							/>
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
									{/* 查看資訊 */}
									<div className="p-2">
										<ViewButton onClick={() => handleViewClick(news)} />
									</div>
									{/* 編輯資料 */}
									<Link href={`./News/editNews/${news.id}`} className="p-2">
										<EditButton />
									</Link>
									{/* 刪除資料 */}
									<div className="p-2">
										<DelButton onClick={() => handleDeleteClick(news.id)} />
									</div>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-5 mb-2">
				{/* 分頁 */}
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={(page) => setCurrentPage(page)}
					changeColor="#fe6f67"
				/>
			</div>
			{/* 詳細資訊 */}
			{selectedNews && (
				<SwalDetails news={selectedNews} onClose={() => setSelectedNews(null)} />
			)}
		</AdminLayout>
	);
}

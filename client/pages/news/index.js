import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import Banner from '@/components/news/banner';
import NewsCard from '@/components/news/newsCard';
import FilterBox from '@/components/news/filterBox';
import Sidebar from '@/components/news/sidebar';
import Tags from '@/components/lesson/tag';
import Pagination from '@/components/pagination';
import IconClassFilter from '@/components/iconClassFilter';
import Footer from '@/components/footer';
import styles from '@/styles/news.module.scss';
import axios from 'axios';
import { FaSearch, FaRegCalendarAlt } from 'react-icons/fa';

export default function News() {
	const [showList, setShowList] = useState(false);
	const [news, setNews] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 6; // 每頁顯示的卡片數量

	const showBox = () => {
		setShowList(!showList);
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const newsToShow = news.slice(startIndex, endIndex);
	const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

	// 右側熱門文章排序
	const smNewsToShow = news
		.slice()
		.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
		.slice(0, 6);

	useEffect(() => {
		console.log('Fetching news...');
		axios
			.get('http://localhost:3005/api/news')
			.then((response) => {
				console.log(response.data); // 查看回應的資料
				setNews(response.data);
			})
			.catch((error) => {
				console.error('Error fetching news:', error);
			});
	}, []);

	return (
		<>
			<Header />
			<Banner />
			<div className="container mt-2">
				<div className="filter-zone-pc d-none d-md-block">
					<FilterBox />
					<div className="d-flex justify-content-center mb-4">
						<IconClassFilter />
					</div>
					<Tags />
				</div>
				<div className="filter-box d-flex d-md-none justify-content-center gap-3">
					<input
						type="text"
						className={`${styles['CTH-keywords']}`}
						id="keywords"
						placeholder="搜尋課程"
					/>
					<button className={styles['LYT-search']}>
						<FaSearch className={styles['CTH-icon']} />
					</button>
					<button className={styles['CTH-calendar']} onClick={showBox}>
						<FaRegCalendarAlt className={styles['CTH-icon']} />
					</button>
				</div>
				{showList && (
					<div className={`${styles['LYT-sm-news-box-filter']} d-md-none`}>
						<h2>熱門文章</h2>
						{smNewsToShow.map((item) => (
							<Sidebar key={item.id} id={item.id} name={item.title} />
						))}
					</div>
				)}
				<div className="row justify-content-between">
					<div className="news-card-group d-flex flex-wrap col-sm-9 col-md-8 justify-content-around">
						{newsToShow.map((item) => (
							<NewsCard
								key={item.id}
								id={item.id}
								img={item.img_path}
								title={item.title}
							/>
						))}
					</div>
					<div className={`${styles['LYT-sm-news-box']} col-auto`}>
						<div className="text-center mb-3">
							<p className="fs-4 fw-bolder">熱門文章</p>
							{smNewsToShow.map((item) => (
								<Sidebar key={item.id} id={item.id} name={item.title} />
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="mb-3">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					changeColor="#fe6f67"
				/>
			</div>
			<Footer />
		</>
	);
}

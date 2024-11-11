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
import { FaRegCalendarAlt, FaSearch } from 'react-icons/fa';

export default function News() {
	const [showList, setShowList] = useState(false);
	const [news, setNews] = useState([]);
	const [sortedNews, setSortedNews] = useState([]); // 新增排序後的狀態
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 6; // 每頁顯示的卡片數量

	const showBox = () => {
		setShowList(!showList);
	};

	// 卡片數量
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const newsToShow = news.slice(startIndex, endIndex);
	const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

	// 右側
	const smNewsToshow = news.slice(0, 6);

	useEffect(() => {
		fetchNews();
	}, []);

	const fetchNews = (searchParams) => {
		axios
			.get('http://localhost:3005/api/news', { params: searchParams })
			.then((response) => {
				setNews(response.data);
				setCurrentPage(1);
			})
			.catch((error) => console.error('Error fetching news:', error));
	};

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
				{showList && (
					<div className={`${styles['LYT-sm-news-box-filter']} d-md-none`}>
						<h2>最新文章</h2>
						{smNewsToshow.map((news, index) => (
							<Sidebar class_name={news.class_name} title={news.title} />
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
							<p className="fs-4 fw-bolder">最新文章</p>
							{smNewsToshow.map((news, index) => (
								<Sidebar
									id={news.id}
									title={news.title}
									product_class={news.product_class}
								/>
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

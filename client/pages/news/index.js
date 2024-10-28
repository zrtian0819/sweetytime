import React from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import Banner from '@/components/news/banner';
import NewsCard from '@/components/news/newsCard';
import FilterBox from '@/components/news/filterBox';
import Sidebar from '@/components/news/sidebar';
import Tags from '@/components/lesson/tag';
import Pagination from '@/components/pagination';
import Footer from '@/components/footer';
import styles from '@/styles/news.module.scss';


export default function News() {
	return (
		<>
			<Header />
			<Banner />
			<div className="container mt-2">
				<div className="filter-zone-pc d-none d-md-block">
					<FilterBox />
					<div className="d-flex justify-content-center">
						<Image src={'icon/decorateIcons.svg'} width={750} height={60} alt="裝飾" />
					</div>
					{/* <Tags /> */}
				</div>
				<div className="filter-zone-mb d-md-none d-block">
					<FilterBox />
				</div>
				<div className='row justify-content-between'>
					<div className="news-card-group d-flex flex-wrap col-sm-9 col-md-8 justify-content-around">
						<NewsCard />
						<NewsCard />
						<NewsCard />
						<NewsCard />
						<NewsCard />
						<NewsCard />
					</div>
					<div className={`${styles['LYT-sm-news-box']} col-auto`}>
						<div className="text-center mb-3 ">
							<p className='fs-4 fw-bolder'>
								熱門文章
							</p>
							<Sidebar />
							<Sidebar />
							<Sidebar />
							<Sidebar />
						</div>
					</div>
				</div>

				<div className='mb-3'>
					<Pagination
						currentPage={1}
						totalPages={5}
						onPageChange={() => { }}
						changeColor="#fe6f67"
					/>
				</div>
			</div>
			<Footer />
		</>
	);
}

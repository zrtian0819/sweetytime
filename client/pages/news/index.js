import React from 'react';
import Header from '@/components/header';
import Banner from '@/components/news/banner';
import NewsCard from '@/components/news/newsCard';
import Sidebar from '@/components/news/sidebar';
import Footer from '@/components/footer';
import styles from '@/styles/news.module.scss';
import Pagination from '@/components/pagination';

export default function News() {
	return (
		<>
			<Header />
			<Banner />
			<div className="container mt-2">
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
						<div className="text-center mb-3">
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

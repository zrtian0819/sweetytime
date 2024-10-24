import React from 'react';
import Header from '@/components/header';
import Banner from '@/components/news/banner';
import NewsCard from '@/components/news/newsCard';
import sidebar from '@/components/news/sidebar';
import Footer from '@/components/footer';
// import styles from '@/styles/news.module.scss';

export default function News() {
	return (
		<>
			<Header />
			<Banner />
			<div className="container mt-2 d-flex justify-content-evenly">
				<div className="card-group"></div>
				<NewsCard />
				<NewsCard />
				<NewsCard />
			</div>
			<div>

      </div>

			<Footer />
		</>
	);
}

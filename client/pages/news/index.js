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
			<div className="container mt-2">
				<div></div>
				<div className='row justify-content-between'></div>
				<div className="card-group d-flex flex-wrap col-sm-9 justify-content-around">
				<NewsCard />
				<NewsCard />
				<NewsCard />
				<NewsCard />
				<NewsCard />
				<NewsCard />
				</div>
				<div>

				</div>
				
			</div>
			<div>

      </div>

			<Footer />
		</>
	);
}

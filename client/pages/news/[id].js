import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import Suggest from '@/components/news/suggest';
import Footer from '@/components/footer';
import styles from '@/styles/newsDetail.module.scss';
import LessonCard from '@/components/lesson/lesson-card';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function NewsDetail(props) {
	const router = useRouter();
	const { id } = router.query;
	const [news, setNews] = useState(null); // 設為 null 以便進行加載判斷
	const [product, setProducts] = useState([]); // 存放 product 資料
	const [lessons, setLessons] = useState([]); // 存放 lesson 資料

	// 抓取單一文章資料
	useEffect(() => {
		console.log('Current news ID:', id);
		if (id) {
			axios
				.get(`http://localhost:3005/api/news/${id}`)
				.then((res) => {
					setNews(res.data);
				})
				.catch((error) => console.error('拿不到新聞資料', error));
		}
	}, [id]);

	// 抓取產品資料 (用於猜你喜歡)
	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/product`)
			.then((res) => setProducts(res.data))
			.catch((error) => console.error('拿不到產品資料', error));
	}, []);

	// 抓取課程資料 (用於推薦課程)
	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson`)
			.then((res) => setLessons(res.data))
			.catch((error) => console.error('拿不到課程資料', error));
	}, []);

	// 移除 content 中的 <p></p> 標籤
	const cleanContent = (content) => {
		return content.replace(/<p>/g, '').replace(/<\/p>/g, '');
	};
	return (
		<>
			<Header />
			{news ? (
				<>
					<div className="container">
						<div className="d-flex align-content-start">
							{/* 標題 */}
							<div className={`${styles['LYT-newsDetailAll']}`}>
								<div className={`${styles['LYT-ceated']}`}>
									<h2 className="fw-bold">{news.title}</h2>
									<h4 className="d-flex justify-content-center">
										by 甜覓小編 {news.createdAt}
									</h4>
								</div>

								{/* 圖片 */}

								{news.img_path && (
									<Image
										src={`/photos/articles/${news.img_path}`} // 確保這是完整路徑
										width={800}
										height={500}
										style={{ objectFit: 'contain' }}
										alt={news.title || 'News Image'}
										className={styles['image']}
										priority // 優先加載
									/>
								)}
								{/* 文字區 */}
								<div className={`${styles['LYT-newsDetail-content']}`}>
									<p>{cleanContent(news.content)}</p>
								</div>
							</div>
						</div>
					</div>

					<div className={`${styles['LYT-detail-bg']} m-0`}>
						{/* 猜你喜歡 - 使用產品資料 */}
						<h1 className={`${styles['LYT-suggeTitle']} pt-5`}>猜你喜歡</h1>
						<div className="row justify-content-center">
							<div className="news-card-group d-flex flex-wrap justify-content-center">
								{product.slice(0, 4).map((product) => (
									<Suggest
										key={product.id}
										id={product.id}
										name={product.name}
										price={`NTD ${product.price}`}
										file_name={product.file_name}
									/>
								))}
							</div>

							{/* 推薦課程 - 使用課程資料 */}
							<h1 className={`${styles['LYT-suggeTitle']} mt-2 pt-5`}>推薦課程</h1>
							<div className="news-card-group d-flex flex-wrap justify-content-center">
								{lessons.slice(0, 4).map((lesson) => (
									<LessonCard
										key={lesson.id}
										id={lesson.id}
										name={lesson.name}
										img={lesson.img_path}
										date={lesson.start_date}
										price={`NTD ${lesson.price}`}
										des={lesson.description}
									/>
								))}
							</div>
						</div>
						<Footer />
					</div>
				</>
			) : (
				<h1>載入中...</h1>
			)}
		</>
	);
}

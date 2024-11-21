import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function CheckoutDone(props) {
	const router = useRouter();
	const { user } = useUser();
	const [lesson, setLesson] = useState([]);
	console.log(user);
	const { id } = router.query;
	useEffect(() => {
		// 檢查登入狀態,不正確則立即導頁
		console.log('查驗程式執行順序');
		if (!user) {
			router.push('/login');
		}
	}, []);

	useEffect(() => {
		const fetchLessonAndSendMail = async () => {
			try {
				// 獲取課程資料
				const lessonRes = await axios.get(`http://localhost:3005/api/lesson/${id}`);
				const lessonData = lessonRes.data.lesson[0];
				setLesson(lessonData);

				// 準備郵件數據
				const data = {
					lesson: lessonData,
					userMail: user.email,
				};

				// 發送郵件
				await axios.post('http://localhost:3005/api/lesson/sendMail', data);
				console.log('郵件發送成功');
			} catch (error) {
				console.error('處理過程中發生錯誤:', error);
			}
		};

		if (lesson) {
			fetchLessonAndSendMail();
		}
	}, [id]);

	return (
		<>
			<Header />
			<section>
				<main>
					<div className="container text-center mt-5 fw-bolder mb-5">
						<h1 className="">您的報名已送出!</h1>
						<a
							href="/user/purchase/lesson_purchase"
							className="ZRT-btn btn-lpnk mt-3 ZRT-click"
						>
							前往我的課程
						</a>
					</div>
				</main>
			</section>
			<Footer />

			<style jsx>
				{`
					section {
						min-height: calc(100vh - 190px);
						width: 100%;
					}

					main {
						padding-top: 150px;
						max-width: 1200px;
						margin-inline: auto;
					}
				`}
			</style>
		</>
	);
}

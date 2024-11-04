import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import LessonCard from '@/components/lesson/lesson-card';
import Footer from '@/components/footer';
import styles from '@/styles/lesson.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LessonDetail(props) {
	const router = useRouter();
	const { id } = router.query;
	const [isLike, setIsLike] = useState(false);
	const [lesson, setLesson] = useState([]);
	const [cardLesson, setCardLesson] = useState([]);
	const handleLike = () => {
		setIsLike(!isLike);
	};
	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson/${id}`)
			.then((response) => setLesson(response.data))
			.catch((error) => console.error('拿不到資料', error));
	}, [id]);

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson`)
			.then((res) => setCardLesson(res.data))
			.catch((error) => console.error('拿不到卡片資料', error));
	}, []);

	const data = lesson[0];
	let sameLocation = [];
	if (data) {
		cardLesson.forEach((lesson) => {
			if (lesson.location === data.location) {
				sameLocation.push(lesson);
			}
		});
	}
	return (
		<>
			<Header />
			{data && cardLesson ? (
				<>
					<div className={`${styles['CTH-banner']} d-none d-md-flex`}>
						<div className={`${styles['banner-left']}`}>
							<Image
								src={`/photos/lesson/${data.img_path}`}
								width={300}
								height={300}
								alt=""
								className={styles['image']}
							/>
							{isLike ? (
								<FaHeart
									className={`${styles['CTH-lesson-card-icon']}`}
									size={30}
									onClick={handleLike}
								/>
							) : (
								<FaRegHeart
									className={styles['CTH-lesson-card-icon']}
									size={30}
									onClick={handleLike}
								/>
							)}
						</div>
						<div className={`${styles['banner-right']}`}>
							<h1>{data.name}</h1>
							<div className={styles['content']}>
								<h3>課程簡介</h3>
								<p>{data.description.slice(0, 100)}</p>
								<div className="d-flex justify-content-between">
									<div>
										<h3>課程日期</h3>
										<p>{data.start_date}</p>
									</div>
									<div>
										<h3>課程師資</h3>
										<p>{data.teacher_id}</p>
									</div>
								</div>
								<div className="d-flex justify-content-between">
									<div>
										<h3>課程價錢</h3>
										<p>NTD {data.price}</p>
									</div>
									<div className={styles['CTH-sign']}>
										<button className="d-flex">
											<FaRegPenToSquare size={30} />
											<h4>我要報名</h4>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={styles['CTH-container']}>
						<div className="container">
							<div className="d-md-none d-flex mt-5 pt-5 flex-column">
								<div className={`${styles['banner-left']} align-self-center`}>
									<Image
										src={`/photos/lesson/${data.img_path}`}
										width={300}
										height={300}
										alt=""
										className={styles['image']}
									/>
									{isLike ? (
										<FaHeart
											className={`${styles['CTH-lesson-card-icon']}`}
											size={30}
											onClick={handleLike}
										/>
									) : (
										<FaRegHeart
											className={styles['CTH-lesson-card-icon']}
											size={30}
											onClick={handleLike}
										/>
									)}
								</div>
								<div className={`${styles['banner-right-mb']}`}>
									<h1>{data.name}</h1>
									<div className={styles['content']}>
										<h3>課程簡介</h3>
										<p>{data.description.slice(0, 100)}</p>
										<div className="d-flex justify-content-between">
											<div>
												<h3>課程日期</h3>
												<p>{data.start_date}</p>
											</div>
											<div>
												<h3>課程師資</h3>
												<p>{data.teacher_id}</p>
											</div>
										</div>
										<div className="d-flex justify-content-between">
											<div>
												<h3>課程價錢</h3>
												<p>NTD {data.teacher_id}</p>
											</div>
											<div className={styles['CTH-sign']}>
												<button className="d-flex">
													<FaRegPenToSquare size={30} />
													<h4>我要報名</h4>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className={`${styles['CTH-class-info']} m-3`}>
								<div className="row justify-content-between align-items-center">
									<div className="class-content col-12 col-md-6 d-none d-md-block">
										<h2>課程介紹</h2>
										<p>{data.description}</p>
									</div>
									<div
										className={`${styles['CTH-class-foto']} col-12 col-md-6 text-center`}
									>
										<Image
											src={`/photos/lesson/${data.img_path}`}
											width={200}
											height={200}
											alt=""
											className={styles['image']}
										/>
										<Image
											src={'/photos/lesson/08_icecream_chen.jpg'}
											width={200}
											height={200}
											alt=""
											className={styles['image']}
										/>
										<Image
											src={'/photos/lesson/09_icecream_chen.jpg'}
											width={200}
											height={200}
											alt=""
											className={styles['image']}
										/>
									</div>
									<div className="class-content col-12 col-md-6 d-block d-md-none">
										<h2>課程介紹</h2>
										<p>{data.description}</p>
									</div>
								</div>
							</div>
							<div className="teacher-info m-3">
								<div className="row justify-content-between">
									<div className="teacher-foto col-12 col-md-6 text-center mb-5">
										<Link href={'../teacher/teacherDetail'}>
											<Image
												src={'/photos/teachers/02_ray.png'}
												width={300}
												height={300}
												className={styles['image']}
												alt=""
											/>
										</Link>
									</div>
									<div
										className={`${styles['CTH-teacher-content']} col-12 col-md-6`}
									>
										<h2>師資介紹</h2>
										<p>{data.teacher_id}的介紹</p>
									</div>
								</div>
							</div>
							<div
								className={`${styles['CTH-lesson-card']} d-flex flex-column justify-content-center`}
							>
								<h2>更多精選課程</h2>
								<div className={`${styles['CTH-lesson-card-group']}`}>
									<div className="d-flex">
										<LessonCard
											id={sameLocation[0].id}
											name={sameLocation[0].name}
											img={sameLocation[0].img_path}
											date={sameLocation[0].start_date}
											price={`NTD ${sameLocation[0].price}`}
											des={sameLocation[0].description}
										/>
										<div className="d-none d-sm-flex">
											<LessonCard
												id={sameLocation[1].id}
												name={sameLocation[1].name}
												img={sameLocation[1].img_path}
												date={sameLocation[1].start_date}
												price={`NTD ${sameLocation[1].price}`}
												des={sameLocation[1].description}
											/>
										</div>
									</div>
									<div className="d-none d-md-flex">
										<LessonCard
											id={sameLocation[2].id}
											name={sameLocation[2].name}
											img={sameLocation[2].img_path}
											date={sameLocation[2].start_date}
											price={`NTD ${sameLocation[2].price}`}
											des={sameLocation[2].description}
										/>
										<LessonCard
											id={sameLocation[3].id}
											name={sameLocation[3].name}
											img={sameLocation[3].img_path}
											date={sameLocation[3].start_date}
											price={`NTD ${sameLocation[3].price}`}
											des={sameLocation[3].description}
										/>
									</div>
								</div>
							</div>
							<div className={`${styles['CTH-location-info']} m-3`}>
								<div className="row justify-content-between align-items-center">
									<div className="location-foto col-12 col-md-6 text-center mb-5">
										<Image
											src={'/photos/lesson/map.png'}
											width={400}
											height={400}
											className={styles['image']}
											alt=""
										/>
									</div>
									<div className="location-content col-12 col-md-6">
										<h2>上課地點</h2>
										<div className="class-name">{data.classroom_name}</div>
										<div className="class-address">{data.location}</div>
										<p className="way">
											交通方式：
											<br />
											1.高鐵🚄
											搭乘高鐵到達苗栗高鐵站後,可轉乘免費接駁公車約20分鐘至【南苗派出所站】下
											車走路 5分鐘左右到達 ★若搭乘計程車約花費15分鐘
											<br />
											2.台鐵🚞
											苗栗火車站下車(騎UBIKE15分鐘/走路25分鐘/計程車10分鐘/市區公車"新竹客運&苗栗客運"搭乘10分鐘（南苗市場站
											or 大同國小站）下車走路1~2分鐘到達) 
											<br />
											3.開車🚗 教室備有停車場 
											<br />
											4.巴士🚌
											"台北旅客"搭乘國光客運往苗栗-【南苗站】下車走路3分鐘到教室 
											<br />
											5.YouBike🚲
											教室旁即YouBike租借站,可騎腳踏車做個美食巡禮💕
										</p>
									</div>
								</div>
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

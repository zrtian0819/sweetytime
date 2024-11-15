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
import { useUser } from '@/context/userContext';

import axios from 'axios';

export default function LessonDetail(props) {
	const router = useRouter();
	const { id } = router.query;
	const [isLike, setIsLike] = useState(false);
	const [lesson, setLesson] = useState([]);
	const [photo, setPhoto] = useState([]);
	const [teacher, setTeacher] = useState([]);
	const [cardLesson, setCardLesson] = useState([]);
	const { user } = useUser();

	const locations = [
		{
			name: 'AcakeADay',
			location: '苗栗縣苗栗市博愛街112號',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.000374881514!2d120.81331157606836!3d24.55464915742498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3469ab374f8cbe2b%3A0xceca3b23128c9cc9!2z5LiA5aSp5Y-q5YGa5LiA5YCL55Sc6bue55qE55Sc6bue5bqXIEEgQ2FrZSBBIERheSjlnJPlpKLng5jnhJnmlZnlrqQp!5e0!3m2!1szh-TW!2stw!4v1730786795856!5m2!1szh-TW!2stw',
			way: (
				<>
					交通方式：
					<br />
					1.高鐵🚄
					搭乘高鐵到達苗栗高鐵站後,可轉乘免費接駁公車約20分鐘至【南苗派出所站】下車走路
					5分鐘左右到達 ★若搭乘計程車約花費15分鐘
					<br />
					2.台鐵🚞
					苗栗火車站下車(騎UBIKE15分鐘/走路25分鐘/計程車10分鐘/市區公車"新竹客運&苗栗客運"搭乘10分鐘（南苗市場站
					or 大同國小站）下車走路1~2分鐘到達)
					<br />
					3.開車🚗 教室備有停車場
					<br />
					4.巴士🚌 "台北旅客"搭乘國光客運往苗栗-【南苗站】下車走路3分鐘到教室
					<br />
					5.YouBike🚲 教室旁即YouBike租借站,可騎腳踏車做個美食巡禮💕
				</>
			),
		},
		{
			name: 'Hemo',
			location: '台中市西屯區朝富路30號2樓',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227.50815993045015!2d120.63749483078861!3d24.167153577751066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693dc14645a237%3A0x749236fd298882dc!2z56eL57SF6LC35bqX!5e0!3m2!1szh-TW!2stw!4v1730787938546!5m2!1szh-TW!2stw',
			way: (
				<>
					交通方式：
					<br />
					1.高鐵🚄 由台中站下車後轉乘高鐵快捷公車，🚍160號
					高鐵台中站－僑光科技大學(朝馬轉運站下車)
					由台中站下車後轉乘計程車，車程約10分鐘抵達禾沐生活學苑。
					<br />
					2.台鐵🚞
					由台中站下車後轉乘優化公車(原BRT)至秋紅谷站下車，步行約4分鐘抵達禾沐生活學苑。
					<br />
					3.開車🚗
					周邊一百公尺內有五大停車場，汽車停車費半小時10元，機車停車費一天20元，輕鬆無負擔。
					🚗秋紅谷停車場:可容納114台汽車和1045台機車，入口在河南路
					🚗惠順停車場:可容納158台汽車和246台機車，入口在河南路 (老虎城正對面)
					🚗朝富停車場:可容納175台汽車和524台機車，入口在市政北六路 (老虎城隔壁 嘟嘟房
					當日當次最高上限120元/點我看信用卡優惠)
					🚗城市車旅朝富站停車場:可容納176台汽車，入口在朝富路 (林酒店隔壁
					當日當次最高上限100元) 🚗城市車旅龍門站停車場:可容納199台汽車，入口在朝富路
					(CBD時代廣場隔壁 當日當次最高上限150元) 🚗周邊道路超過300個停車位!!
					<br />
					4.巴士🚌
					搭乘49路、74路、75路、658路公車在朝馬轉運站(朝富路)下車即可抵達禾沐生活學苑門口
					<br />
				</>
			),
		},
		{
			name: '樂朋烘焙手作',
			location: '台北市大安區市民大道四段68巷4號',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d903.6709245211446!2d121.54657866963224!3d25.044806113623324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a997800ab6d1%3A0x97069e2b66d5843d!2z5qiC5pyL54OY54SZ5pWZ5a6k!5e0!3m2!1szh-TW!2stw!4v1730789143112!5m2!1szh-TW!2stw"',
			way: (
				<>
					交通方式：
					<br />
					1.捷運：忠孝復興站 (出口：東區地下街11號或14號)，步行約5分
					<br />
					2.公車：微風廣場站或市民敦化路口站
					<br />
					3.停車場：市民大道復敦停車場或路邊停車格
				</>
			),
		},
		{
			name: '庚申伯手作烘焙',
			location: '高雄市仁武區八德西路１１６號',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.4245348492523!2d120.32971807602966!3d22.675234829199464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e0556717fb6c1%3A0xcfc8f8be3ab7e2dc!2z5bqa55Sz5Lyv5omL5L2c54OY54SZ5pWZ5a6k!5e0!3m2!1szh-TW!2stw!4v1730789311878!5m2!1szh-TW!2stw',
			way: <>教室提供免費高鐵接駁🚄🚄 教室附近有停車場🚗🚗</>,
		},
		{
			name: '弘學苑',
			location: '台中市南屯區大墩十二街292號3樓，近文心路與公益路口',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.6154779741!2d120.64534707605958!3d24.150138473311486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d95ee5fe913%3A0xb30df1ca0e7ac094!2z5byY5a246IuRLeW8mOWFieenkeaKgOWkp-WtuOWkp-WiqeaOqOW7o-aVmeiCsuS4reW_gw!5e0!3m2!1szh-TW!2stw!4v1730789437887!5m2!1szh-TW!2stw',
			way: <></>,
		},
		{
			name: '110 食驗室 廚藝烘焙手作',
			location: '111台北市士林區文林路730號1樓',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.9751022649825!2d121.51799067608025!3d25.102704135520202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ae9bb28d1f4f%3A0x13205041402df0bd!2zMTEwIOmjn-mpl-WupCDlu5rol53ng5jnhJnmiYvkvZw!5e0!3m2!1szh-TW!2stw!4v1730789652757!5m2!1szh-TW!2stw',
			way: (
				<>
					交通方式：
					<br />
					1.機車：騎乘機車沿著文林路直接前往目的地。
					<br />
					2.汽車：開車沿著文林路行駛，找到目的地。
					<br />
					3.大眾交通工具：
					<br />
					捷運：搭乘捷運至士林捷運站，從捷運站出口出來後，步行前往文林路730號。
					<br />
					公車：搭乘到文林路附近的公車，下車後步行至目的地。可能的公車路線包括紅25、紅30、紅31等。
				</>
			),
		},
		{
			name: 'Hananeco花貓蛋糕實驗室',
			location: '新北市永和區仁愛路49號1樓 (近頂溪捷運站2號出口)',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.6140665730027!2d121.51122007607832!3d25.013226639126284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a9a55f661635%3A0x448d3750a9819e70!2zSGFuYW5lY2_oirHospPom4vns5Xlr6bpqZflrqQ!5e0!3m2!1szh-TW!2stw!4v1730789842467!5m2!1szh-TW!2stw',
			way: (
				<>
					交通方式：
					<br />
					捷運：捷運頂溪站 2 號出口步行約 3 分鐘
				</>
			),
		},
		{
			name: '橙品手作烘焙廚藝教室',
			location: '台北市北投區裕民六路130號1樓',
			src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.617477120012!2d121.5151255760805!3d25.114806935031645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ae8c5023a459%3A0x352f92bb6296358b!2z5qmZ5ZOB5omL5L2c54OY54SZ5bua6Jed!5e0!3m2!1szh-TW!2stw!4v1730789974176!5m2!1szh-TW!2stw',
			way: (
				<>
					交通方式：
					<br />
					【開車】於教室附近，設有三個收費停車場，可自行選擇方便的入口。
					<br />
					🔺明德路：Mingde Car Park停車場，距離教室走路約6分鐘
					<br /> 🔺懷德路：168Parking (懷德停車場)，距離教室走路約5分鐘
					<br /> 🔺裕民二路：168Parking (168停車場)，距離教室走路約1-2分鐘
					<br /> 🔺在教室外的路邊皆有停車格可停車
					<br />
					歡迎開車來上課，輕鬆又方便✿
					<br />
					【捷運】搭乘捷運紅線至石牌捷運站，於２號出口出站，步行約5分鐘。
				</>
			),
		},
	];

	const handleLike = (id) => {
		console.log(id);
		setIsLike(!isLike);
	};

	const checkOut = () => {
		router.push(`http://localhost:3000/cart/lessonCheckout/${data.id}`);
	};

	const goLogin = () => {
		router.push(`http://localhost:3000/login`);
	};
	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson/${id}`)
			.then((response) => {
				setPhoto(response.data.photo);
				setLesson(response.data.lesson);
				setTeacher(response.data.teacher);
			})
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
	if (data && cardLesson.length > 0) {
		cardLesson.forEach((lesson) => {
			if (lesson.location === data.location) {
				sameLocation.push(lesson);
			}
		});
	}
	return (
		<>
			<Header />
			{data ? (
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
									onClick={(e) => {
										handleLike(data.id);
									}}
								/>
							) : (
								<FaRegHeart
									key={data.id}
									className={styles['CTH-lesson-card-icon']}
									size={30}
									onClick={(e) => {
										handleLike(data.id);
									}}
								/>
							)}
						</div>
						<div className={`${styles['banner-right']} mt-3`}>
							<h1>{data.name}</h1>
							<div className={styles['content']}>
								<h3>課程簡介</h3>
								<p
									dangerouslySetInnerHTML={{
										__html: data.description.slice(0, 100) + '...',
									}}
								></p>
								<div className="d-flex justify-content-between">
									<div>
										<h3>課程日期</h3>
										<p>{data.start_date}</p>
									</div>
									<div>
										<h3>課程師資</h3>
										<p>{teacher[0].name}</p>
									</div>
								</div>
								<div className="d-flex justify-content-between">
									<div>
										<h3>課程價錢</h3>
										<p>NTD {data.price}</p>
									</div>
									<div>
										{user ? (
											<>
												<button
													className={styles['ZRT-btn']}
													onClick={checkOut}
												>
													<div className="d-flex align-items-center">
														<FaRegPenToSquare size={30} />
														<div>我要報名</div>
													</div>
												</button>
											</>
										) : (
											<>
												<button
													className={styles['ZRT-btn']}
													onClick={goLogin}
												>
													<div className="d-flex align-items-center">
														<FaRegPenToSquare size={30} />
														<div>登入後報名</div>
													</div>
												</button>
											</>
										)}
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
										<p
											dangerouslySetInnerHTML={{
												__html: data.description.slice(0, 100) + '...',
											}}
										></p>
										<div className="d-flex justify-content-between">
											<div>
												<h3>課程日期</h3>
												<p>{data.start_date}</p>
											</div>
											<div>
												<h3>課程師資</h3>
												<p>{teacher[0].name}</p>
											</div>
										</div>
										<div className="d-flex justify-content-between">
											<div>
												<h3>課程價錢</h3>
												<p>NTD {data.price}</p>
											</div>
											<div>
												{user ? (
													<>
														<button
															className={styles['ZRT-btn']}
															onClick={checkOut}
														>
															<div className="d-flex align-items-center">
																<FaRegPenToSquare size={30} />
																<div>我要報名</div>
															</div>
														</button>
													</>
												) : (
													<>
														<Link href={`/login`}>
															<button className="d-flex">
																<FaRegPenToSquare size={30} />
																<h4>登入後報名</h4>
															</button>
														</Link>
													</>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className={`${styles['CTH-class-info']} m-3`}>
								<div className="row justify-content-between align-items-center">
									<div className="class-content col-12 col-md-6 d-none d-md-block">
										<h2>課程介紹</h2>
										<div
											dangerouslySetInnerHTML={{
												__html: data.description,
											}}
										></div>
									</div>
									<div
										className={`${styles['CTH-class-foto']} col-12 col-md-6 text-center`}
									>
										{photo.length > 0
											? photo.map((photo) => (
													<Image
														key={photo.id}
														src={`/photos/lesson/${photo.file_name}`}
														width={200}
														height={200}
														alt=""
														className={styles['image']}
													/>
											  ))
											: '還未有其他照片！'}
									</div>
									<div className="class-content col-12 col-md-6 d-block d-md-none">
										<h2>課程介紹</h2>
										<div
											dangerouslySetInnerHTML={{
												__html: data.description,
											}}
										></div>
									</div>
								</div>
							</div>
							<div className={`${styles['CTH-teacher-info']}  m-3`}>
								<div className="row justify-content-between">
									<div className="teacher-foto col-12 col-md-6 text-center mb-5">
										<Link href={'../teacher/teacherDetail'}>
											<Image
												src={`/photos/teachers/${teacher[0].img_path}`}
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
										<p>{teacher[0].description}</p>
									</div>
								</div>
							</div>
							<div
								className={`${styles['CTH-lesson-card']} d-flex flex-column justify-content-center`}
							>
								<h2>更多精選課程</h2>
								<div className={`${styles['CTH-lesson-card-group']}`}>
									<div className="d-flex">
										{sameLocation.length > 0 ? (
											<>
												<LessonCard
													id={sameLocation[0].id}
													name={sameLocation[0].name}
													img={sameLocation[0].img_path}
													date={sameLocation[0].start_date}
													price={`NTD ${sameLocation[0].price}`}
													des={sameLocation[0].description}
												/>
											</>
										) : (
											''
										)}

										{sameLocation.length > 1 ? (
											<>
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
											</>
										) : (
											''
										)}
									</div>
									{sameLocation.length > 2 ? (
										<>
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
										</>
									) : (
										''
									)}
								</div>
							</div>
							<div className={`${styles['CTH-location-info']} m-3`}>
								<div className="row justify-content-between align-items-center">
									{locations.map((loc) => {
										if (loc.location === data.location) {
											return (
												<>
													<div className="location-foto col-12 col-md-6">
														<iframe
															src={loc.src}
															width="100%"
															height="400px"
															style={{ border: 0 }}
															loading="lazy"
															referrerpolicy="no-referrer-when-downgrade"
														></iframe>
													</div>
													<div className="location-content col-12 col-md-6">
														<h2>上課地點</h2>
														<div className="class-name">
															{data.classroom_name}
														</div>
														<div className="class-address">
															{data.location}
														</div>
														<p className="way">{loc.way}</p>
													</div>
												</>
											);
										}
									})}
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

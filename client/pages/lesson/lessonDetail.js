import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import { FaRegPenToSquare } from 'react-icons/fa6';
import LessonCard from '@/components/lesson/lesson-card';
import Footer from '@/components/footer';
import styles from '@/styles/lesson.module.scss';
import Link from 'next/link';

export default function LessonDetail(props) {
	return (
		<>
			<Header />
			<div className={`${styles['CTH-banner']} d-none d-md-flex`}>
				<div className={`${styles['banner-left']}`}>
					<Image
						src={'/photos/lesson/07_icecream_chen.jpg'}
						width={300}
						height={300}
						alt=""
						className={styles['image']}
					/>
				</div>
				<div className={`${styles['banner-right']}`}>
					<h1>冰淇淋特訓班</h1>
					<div className={styles['content']}>
						<h3>課程簡介</h3>
						<p>
							炎炎夏日即將來臨…冰淇淋快快搶先報‼️⁉️自己做的冰淇淋總是沙沙的、不滑順？十萬個為什麼將在課堂裡為大家解惑
							不用機器儘靠著雙手與簡單的器具即能完成️
							課堂中會講解理論與分組實做多種不同的冰淇淋
						</p>
						<div className="d-flex justify-content-between">
							<div>
								<h3>課程日期</h3>
								<p>2024/9/15 (日) 14:00</p>
							</div>
							<div>
								<h3>課程師資</h3>
								<p>陳上瑞</p>
							</div>
						</div>
						<div className="d-flex justify-content-between">
							<div>
								<h3>課程價錢</h3>
								<p>NTD 1500</p>
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
								src={'/photos/lesson/07_icecream_chen.jpg'}
								width={300}
								height={300}
								alt=""
								className={styles['image']}
							/>
						</div>
						<div className={`${styles['banner-right-mb']}`}>
							<h1>冰淇淋特訓班</h1>
							<div className={styles['content']}>
								<h3>課程簡介</h3>
								<p>
									炎炎夏日即將來臨…冰淇淋快快搶先報‼️⁉️自己做的冰淇淋總是沙沙的、不滑順？十萬個為什麼將在課堂裡為大家解惑
									不用機器儘靠著雙手與簡單的器具即能完成️
									課堂中會講解理論與分組實做多種不同的冰淇淋
								</p>
								<div className="d-flex justify-content-between">
									<div>
										<h3>課程日期</h3>
										<p>2024/9/15 (日) 14:00</p>
									</div>
									<div>
										<h3>課程師資</h3>
										<p>陳上瑞</p>
									</div>
								</div>
								<div className="d-flex justify-content-between">
									<div>
										<h3>課程價錢</h3>
										<p>NTD 1500</p>
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
								<p>
									炎炎夏日即將來臨…冰淇淋快快搶先報‼️⁉️自己做的冰淇淋總是沙沙的、不滑順？十萬個為什麼將在課堂裡為大家解惑
									不用機器儘靠著雙手與簡單的器具即能完成️
									課堂中會講解理論與分組實做多種不同的冰淇淋
								</p>
								<p>
									課程品項：
									<br />
									西西里開心果
									<br />
									帕林內焦糖榛果
									<br />
									美式餅乾乳酪
									<br />
									法式柑橘雪酪
									<br />
									新鮮草莓雪酪
									<br />
									2種不同配料酥脆餅乾碎法式焦糖榛果🌈
									<br />
									課程會提供義大利進口包材課後可帶回冰淇淋2盒需自備保冷袋與冰磚以便將冰淇淋帶回
								</p>
							</div>
							<div
								className={`${styles['CTH-class-foto']} col-12 col-md-6 text-center`}
							>
								<Image
									src={'/photos/lesson/07_icecream_chen.jpg'}
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
								<p>
									炎炎夏日即將來臨…冰淇淋快快搶先報‼️⁉️自己做的冰淇淋總是沙沙的、不滑順？十萬個為什麼將在課堂裡為大家解惑
									不用機器儘靠著雙手與簡單的器具即能完成️
									課堂中會講解理論與分組實做多種不同的冰淇淋
								</p>
								<p>
									課程品項：
									<br />
									西西里開心果
									<br />
									帕林內焦糖榛果
									<br />
									美式餅乾乳酪
									<br />
									法式柑橘雪酪
									<br />
									新鮮草莓雪酪
									<br />
									2種不同配料酥脆餅乾碎法式焦糖榛果🌈
									<br />
									課程會提供義大利進口包材課後可帶回冰淇淋2盒需自備保冷袋與冰磚以便將冰淇淋帶回
								</p>
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
							<div className={`${styles['CTH-teacher-content']} col-12 col-md-6`}>
								<h2>師資介紹</h2>
								<p>
									1989 法式烘焙·甜點 專門🥐🍰🍫喜歡自己一個人去旅行✈️🇫🇷2018
									雷諾特廚藝學院🇯🇵2016
									藍帶廚藝學院🇹🇼烘焙乙級-蛋糕麵包期許給個機會·與您分享我的作品
									<br />
									擅長品項：日式甜點法式甜點
									<br />
									證照： 台灣烘焙西點蛋糕乙級證照 台灣烘焙麵包乙級證照
								</p>
							</div>
						</div>
					</div>
					<div
						className={`${styles['CTH-lesson-card']} d-flex flex-column justify-content-center`}
					>
						<h2>更多精選課程</h2>
						<div className={`${styles['CTH-lesson-card-group']}`}>
							<div className="d-flex">
								<LessonCard />
								<LessonCard />
							</div>
							<div className="d-none d-md-flex">
								<LessonCard />
								<LessonCard />
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
								<div className="class-name">A CAKE A DAY圓夢烘焙教室</div>
								<div className="class-address">360苗栗縣苗栗市博愛街112號</div>
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
									5.YouBike🚲 教室旁即YouBike租借站,可騎腳踏車做個美食巡禮💕
								</p>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}

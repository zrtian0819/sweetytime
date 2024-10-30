import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import Suggest from '@/components/news/suggest';
import Footer from '@/components/footer';
import styles from '@/styles/newsDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function NewsDetail() {
	return (
		<>
			<Header />
			<div className="container ">
				{/* 標題 */}
				<div className={`${styles['LYT-newsDetailAll']}`}>
					<h2 className="fw-bold">美味料理食譜：經典法式甜點！檸檬萊姆塔的酸甜滋味</h2>
					<div className={`${styles['LYT-ceated']} ms-3`}>
						<h4>by 甜覓小編 2024/09/25</h4>
					</div>
					{/* 圖片 */}
					<Image
						src={'/photos/articles/eatDessertTime.jpg'}
						width={800}
						height={500}
						alt="文章"
					/>

					{/* 文字區 */}
					<div className={`${styles['LYT-newsDetail-content']} m-2`}>
						<h4>
							偷偷告訴妳，檸檬塔的故事，這是一道傳統且歷史久遠，並且已有多樣化演變的甜點。
						</h4>
						<p>
							從名稱 Tarteau
							Citron或許會直接聯想到甜點王國-法國，不過檸檬塔最早緣起和流行於地中海一帶，而法國的檸檬塔最早起源自法國南部城市-芒通(Menton,France)。
						</p>
						<p>
							在芒通每年會舉辦檸檬節，其中檸檬塔始終是節慶的一大亮點。而由於檸檬塔的獨到好滋味，現在在法國的甜品店，咖啡廳或下午茶坊都可以看到它的身影，近年來台灣、日本也受法國甜點文化感染，於是也有越來越多的店，和越來越多師傅開始製作檸檬塔。
						</p>
						<p>
							其中點燃大眾對檸檬塔的好奇的契機則在幾年前一部講述英國國寶級美食作家Nigel
							Slater 的電影『吐司：敬！美味人生』(《Toast》)，當中
							Nigel和繼母比拚的檸檬塔，那光澤的蛋白霜和紮實黃澄澄的檸檬奶油餡，讓觀眾看得嘆為觀止又忍不住在螢幕前流口水，而Reckless
							Cook 則是在拜讀法國甜點大師 Pierre
							Hermé的食譜，乘著潮流加上好朋友兼食客的提議下，在 Reckless
							Oven出產的第一項客製產品！
						</p>
						<div>
							<h4>自己動手做食譜 (6吋)</h4>
							<ul>
								<li>I.檸檬奶油醬</li>
								<li>檸檬汁 50 cc</li>
								<li>萊姆汁 35 cc</li>
								<li>雞蛋 2 顆</li>
								<li>奶油 180g</li>
								<li>香草莢 1條(7g香草籽)</li>
								<li>檸檬皮 1顆</li>
							</ul>

							<ul>
								<li>II.塔皮</li>
								<li>低筋麵粉 160g</li>
								<li>糖 40~60g (根據需要甜度調整)</li>
								<li>奶粉 6og</li>
								<li>奶油 120g</li>
							</ul>
							<ul>
								<li>III. 蛋白霜</li>
								<li>蛋白 3~5個 (根據裝飾量調整)</li>
								<li>糖 180~300g</li>
							</ul>
						</div>
						<div>
							<h3>製作手續三步驟</h3>
							<h4>首先先煮製檸檬奶油醬</h4>
							<p>
								將雞蛋打散於一煮鍋內備於旁，加熱煮滾檸檬、萊姆汁、香草莢和砂糖，滾後將香草籽自香草莢刮入鍋中，將豆莢的部分丟掉，接著丟奶油入鍋融化並攪拌均勻，最後沿著盛有打散雞蛋的鍋子鍋緣一邊攪拌一邊將檸檬奶油液倒入，務必要一邊攪拌一邊倒入，否則蛋液在受熱不均勻的情況下部分容易形成蛋花。確實攪拌後再次將鍋子移到瓦斯爐上加熱，一邊加熱一邊攪拌，避免受熱不均底部焦化，不斷加熱直到鍋內呈現濃稠冒泡即可。煮好的檸檬奶油醬倒入一保鮮盒中，放入冰箱冷藏，至少五小時後才能使用。
							</p>
							<h4>2. 第二步驟是製作杏仁奶香塔皮</h4>
							<p>
								將奶油塊切丁，置於鍋中放軟(以便於操作)，接著分別將杏仁粉、奶粉、糖粉和麵粉篩入，均勻混合粉類和奶油，然後倒入牛奶並打入雞蛋，在揉混均勻後用一保鮮膜包起麵團，並擀成約1cm的薄片，置於冰箱備用，至少要冰一小時左右讓麵糰鬆弛才能使用。鬆弛完成的麵團，再擀成0.5cm的厚度，鋪平在塔盤中，用派石壓好，放入預熱好180度的烤箱，烤30分鐘即可。
							</p>
							<h4>3. 第三步驟是檸檬蛋白霜。</h4>
							<p>
								這一步驟得在前面兩步驟均完成，塔皮烤好並冷卻，且檸檬奶油餡已填入塔皮內，並冷藏一小時後執行。
								先用煮砂糖，煮成119度的糖漿，然後一邊用電動打蛋器高速打發蛋白，一邊沿著鍋緣倒入糖漿，打到七分發左右(攪拌器提起蛋白成嘴喙勾狀)，接著將蛋白霜裝入擠花袋中，由內而外擠在檸檬奶油餡上，然後再擠完一圈後再擠一球一球形成小山狀。
							</p>
							<h3>品味檸檬萊姆塔時間到！</h3>
							<p>
								成功完成的檸檬萊姆塔必須是奶油餡凝固，聞起來有檸檬香，切的時候切面整齊，奶油霜不會軟軟融化（需要有足夠的冷藏時間），吃的時候蛋白霜是綿細融於口，奶油餡酸甜在舌尖劃開，先甜後酸，後味是檸檬清香感，而塔皮則將杏仁與奶香味帶入調和。
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className={`${styles['LYT-detail-bg']} m-2`}>
				<div className={`${styles['LYT-suggeTitle']}`}>
					<h1>-猜你喜歡-</h1>
				</div>
				<div className="row justify-content-center">
					<div className="news-card-group d-flex flex-wrap col-sm-9 col-md-8 justify-content-center">
						<Suggest />
						<Suggest />
						<Suggest />
						<Suggest />
					</div>

					<div className={`${styles['LYT-suggeTitle']}`}>
						<h1>-推薦課程-</h1>
					</div>
					<div className="news-card-group d-flex flex-wrap col-sm-9 col-md-8 justify-content-center">
						<Suggest />
						<Suggest />
						<Suggest />
						<Suggest />
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

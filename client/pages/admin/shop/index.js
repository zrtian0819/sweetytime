import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import styles from '@/styles/adminShop.module.scss';
import Pagination from '@/components/pagination';
import StatusTabs from '@/components/adminShop/StatusTabs';
import SearchBar from '@/components/adminShop/SearchBar';
import { FaEye, FaEdit, FaToggleOn } from 'react-icons/fa';
import Image from 'next/image';

export default function Shop() {
	const ITEMS_PER_PAGE = 5;

	//暫時假資料
	const initialShops = [
		{
			shop_id: 1,
			name: '花磚甜點',
			logo_path: 'sugar_logo.png',
			phone: '02-25472917',
			address: '台北市松山區敦化北路145巷5號',
			sign_up_time: '2024/8/14 下午 4:03:00',
			description:
				'純粹不斷重複動作，追求極致質感高品質食材選用,細膩手法的單一品項,內餡與餅皮的完美結合,是美好時光的最好陪襯,層層堆疊超過三十層餅皮,品嚐的每一口都是時間與食材結合的細緻風味,季節選用與茶香茗品,我們追求更單純且值得回味的呈現',
			status: '營業中',
		},
		{
			shop_id: 2,
			name: '花磚甜點',
			logo_path: 'sugar_logo.png',
			phone: '02-25472917',
			address: '台北市松山區敦化北路145巷5號',
			sign_up_time: '2024/8/14 下午 4:03:00',
			description:
				'純粹不斷重複動作，追求極致質感高品質食材選用,細膩手法的單一品項,內餡與餅皮的完美結合,是美好時光的最好陪襯,層層堆疊超過三十層餅皮,品嚐的每一口都是時間與食材結合的細緻風味,季節選用與茶香茗品,我們追求更單純且值得回味的呈現',
			status: '營業中',
		},
		{
			shop_id: 3,
			name: '花磚甜點',
			logo_path: 'sugar_logo.png',
			phone: '02-25472917',
			address: '台北市松山區敦化北路145巷5號',
			sign_up_time: '2024/8/14 下午 4:03:00',
			description:
				'純粹不斷重複動作，追求極致質感高品質食材選用,細膩手法的單一品項,內餡與餅皮的完美結合,是美好時光的最好陪襯,層層堆疊超過三十層餅皮,品嚐的每一口都是時間與食材結合的細緻風味,季節選用與茶香茗品,我們追求更單純且值得回味的呈現',
			status: '營業中',
		},
		{
			shop_id: 4,
			name: '花磚甜點',
			logo_path: 'sugar_logo.png',
			phone: '02-25472917',
			address: '台北市松山區敦化北路145巷5號',
			sign_up_time: '2024/8/14 下午 4:03:00',
			description:
				'純粹不斷重複動作，追求極致質感高品質食材選用,細膩手法的單一品項,內餡與餅皮的完美結合,是美好時光的最好陪襯,層層堆疊超過三十層餅皮,品嚐的每一口都是時間與食材結合的細緻風味,季節選用與茶香茗品,我們追求更單純且值得回味的呈現',
			status: '營業中',
		},
		{
			shop_id: 5,
			name: '花磚甜點',
			logo_path: 'sugar_logo.png',
			phone: '02-25472917',
			address: '台北市松山區敦化北路145巷5號',
			sign_up_time: '2024/8/14 下午 4:03:00',
			description:
				'純粹不斷重複動作，追求極致質感高品質食材選用,細膩手法的單一品項,內餡與餅皮的完美結合,是美好時光的最好陪襯,層層堆疊超過三十層餅皮,品嚐的每一口都是時間與食材結合的細緻風味,季節選用與茶香茗品,我們追求更單純且值得回味的呈現',
			status: '營業中',
		},
		{
			shop_id: 6,
			name: '花磚甜點',
			logo_path: 'sugar_logo.png',
			phone: '02-25472917',
			address: '台北市松山區敦化北路145巷5號',
			sign_up_time: '2024/8/14 下午 4:03:00',
			description:
				'純粹不斷重複動作，追求極致質感高品質食材選用,細膩手法的單一品項,內餡與餅皮的完美結合,是美好時光的最好陪襯,層層堆疊超過三十層餅皮,品嚐的每一口都是時間與食材結合的細緻風味,季節選用與茶香茗品,我們追求更單純且值得回味的呈現',
			status: '營業中',
		},
		{
			shop_id: 7,
			name: '花磚甜點',
			logo_path: 'sugar_logo.png',
			phone: '02-25472917',
			address: '台北市松山區敦化北路145巷5號',
			sign_up_time: '2024/8/14 下午 4:03:00',
			description:
				'純粹不斷重複動作，追求極致質感高品質食材選用,細膩手法的單一品項,內餡與餅皮的完美結合,是美好時光的最好陪襯,層層堆疊超過三十層餅皮,品嚐的每一口都是時間與食材結合的細緻風味,季節選用與茶香茗品,我們追求更單純且值得回味的呈現',
			status: '營業中',
		},
	];

	const [searchShop, setSearchShop] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState('全部');

	const filteredShops = initialShops.filter(
		(shop) =>
			shop.name.toLowerCase().includes(searchShop.toLowerCase()) &&
			(selectedStatus === '全部' || shop.status === selectedStatus)
	);

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentShops = filteredShops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);

	return (
		<AdminLayout>
			<div className={styles.ShopPage}>
				{/* 搜尋欄位 */}
				<SearchBar searchShop={searchShop} setSearchShop={setSearchShop} />

				{/* 狀態篩選標籤 */}
				<StatusTabs selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />

				{/* 列表表格 */}
				<div className="container-fluid">
					<table className={`${styles.ShopTable} w-100`}>
						<thead className="text-center">
							<tr className="row">
								<th className="col-1">ID</th>
								<th className="col-1">店家名稱</th>
								<th className="col-1">Logo</th>
								<th className="col-1">電話</th>
								<th className="col-2">地址</th>
								<th className="col-3">描述</th>
								<th className="col-2">註冊時間</th>
								<th className="col-1">操作</th>
							</tr>
						</thead>
						<tbody>
							{currentShops.map((shop) => (
								<tr
									key={shop.shop_id}
									className="row text-center"
									style={{ height: '100px' }}
								>
									<td className={`${styles['TIL-content']} col-1`}>
										{shop.shop_id}
									</td>
									<td className={`${styles['TIL-content']} col-1`}>
										{shop.name}
									</td>
									<td className={`${styles['TIL-content']} col-1`}>
										<Image
											src={`/photos/shop_logo/${shop.logo_path}`}
											alt={shop.name}
											width={50}
											height={50}
											className={styles.ShopImage}
										/>
									</td>
									<td className={`${styles['TIL-content']} col-1`}>
										{shop.phone}
									</td>
									<td className={`${styles['TIL-content']} col-2`}>
										{shop.address}
									</td>
									<td className={`${styles['TIL-content']} col-3`}>
										<div className={`${styles.description} text-start`}>
											{shop.description}
										</div>
									</td>
									<td className={`${styles['TIL-content']} col-2`}>
										{shop.sign_up_time}
									</td>
									<td className={`${styles['TIL-content']} col-1 gap-2`}>
										<button className={`${styles.actionButton}`}>
											<FaEye />
										</button>
										<button className={styles.actionButton}>
											<FaEdit />
										</button>
										<button className={styles.actionButton}>
											<FaToggleOn />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* 分頁 */}
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</div>
		</AdminLayout>
	);
}

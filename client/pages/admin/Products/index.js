import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import Pagination from '@/components/pagination';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import AdminTab from '@/components/adminTab';
import AddButton from '@/components/adminCRUD/addButton';
import SearchBar from '@/components/adminSearch';

import styles from '@/styles/adminProducts/adminProduct.module.scss';
import axios from 'axios';

export default function Products(props) {
	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'open', label: '已上架商品' },
		{ key: 'close', label: '已下架商品' },
	];
	const [status, setStatus] = useState('all');

	// ===========================取全部商品資料=============================
	const [products, setProducts] = useState([]);
	useEffect(() => {
		axios
			.get('http://localhost:3005/api/product/admin')
			.then((res) => setProducts(res.data))
			.catch((error) => console.error('Error fetching data:', error));
	}, []);

	// ============================換頁功能==============================
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 5; // 每頁顯示的卡片數量
	// 計算當前頁顯示的卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentPageProducts = products.slice(startIndex, endIndex);
	// 計算總頁數
	const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

	return (
		<>
			<AdminLayout>
				<div className="d-flex justify-content-between">
					<SearchBar
					// keyword={keyword}
					// onKeywordChange={handleKeywordChange}
					// handleSearchChange={handleSearchBtn}
					// onRecover={clearBtn ? onRecover : null}
					/>
					<AddButton href="/admin/Lessons/addLesson" />
				</div>
				<AdminTab tabs={tabs} activeTab={status} setActiveTab={setStatus} />
				<table className={`${styles['table']} w-100 mb-3`}>
					<thead class="text-center">
						<tr>
							<th>照片</th>
							<th>編號</th>
							<th>品名</th>
							<th>價格</th>
							<th>商店</th>
							<th>分類</th>
							<th>描述</th>
							<th>關鍵字</th>
							<th>狀態</th>
							<th>折扣率</th>
							<th>庫存</th>
							<th>詳細資訊</th>
						</tr>
					</thead>
					<tbody>
						{currentPageProducts.map((product) => {
							return (
								<>
									<tr class="text-center align-middle">
										<td className={`${styles['table-photo']}`}>
											<div className={`${styles['photoContainer']}`}>
												<Image
													className={`${styles['photo']}`}
													src={`/photos/products/${product.file_name}`}
													fill
												/>
											</div>
										</td>
										<td className={`${styles['table-id']}`}>{product.id}</td>
										<td className={`${styles['table-name']}`}>
											{product.name}
										</td>
										<td className={`${styles['table-price']}`}>
											{product.price}
										</td>
										<td className={`${styles['table-shop']}`}>
											{product.shop_name}
										</td>
										<td className={`${styles['table-class']}`}>
											{product.class_name}
										</td>
										<td className={`${styles['table-descriptions']}`}>
											{product.description}
										</td>
										<td className={`${styles['table-keywords']}`}>
											{product.keywords}
										</td>
										<td className={`${styles['table-available']}`}>
											{product.available}
										</td>
										<td className={`${styles['table-discount']}`}>
											{product.discount}
										</td>
										<td className={`${styles['table-stocks']}`}>
											{product.stocks}
										</td>
										<td className={`${styles['table-edit']}`}>
											<div className="d-flex gap-2 justify-content-end pe-2">
												<Link href={`./Products/viewProduct/${product.id}`}>
													<ViewButton />
												</Link>
												<Link href={`./Products/editProduct/${product.id}`}>
													<EditButton />
												</Link>
												<ToggleButton
													onClick={() => {
														handleToggleClick(product.id);
													}}
													isActive={product.available == 1}
												/>
											</div>
										</td>
									</tr>
								</>
							);
						})}
					</tbody>
				</table>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={(page) => setCurrentPage(page)}
					changeColor="#fe6f67"
				/>
			</AdminLayout>
		</>
	);
}

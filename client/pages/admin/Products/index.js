import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

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

import { useUser } from '@/context/userContext';

export default function Products(props) {
	const { user, logout } = useUser();
	console.log('user:', user);

	// =============================取全部店家資訊===============================
	const [shops, setShops] = useState([]);
	useEffect(() => {
		axios
			.get('http://localhost:3005/api/shops-sidebar')
			.then((res) => setShops(res.data))
			.catch((error) => console.error('Error fetching data:', error));
	}, []);

	// =============================狀態管理=================================
	const [products, setProducts] = useState([]);
	const [filterCriteria, setFilterCriteria] = useState({
		search: '',
		availability: '',
		isDeleted: '',
		shopId: '',
		order: '',
	});
	const [shopData, setShopData] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 10;

	// =============================函數定義=================================
	// 獲取商品資料的函數，接受自訂的篩選條件
	const fetchProducts = async (criteria) => {
		try {
			const productsResponse = await axios.get('http://localhost:3005/api/product/admin', {
				params: criteria,
			});
			const productsData = productsResponse.data;
			console.log('productsData:', productsData);

			setProducts(productsData);
			setCurrentPage(1);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	// 更新篩選條件的函數
	const handleChangeFilterCriteria = (key, value) => {
		setFilterCriteria((prevCriteria) => ({ ...prevCriteria, [key]: value }));
	};

	// 專給搜尋用的
	const [searchKeyword, setSearchKeyword] = useState('');
	const handleSearchKeywordChange = (value) => {
		setSearchKeyword(value);
	};
	const handleClearSearch = () => {
		setSearchKeyword('');
	};

	// 角色為店家時鎖死店家及刪除篩選條件，並在設定完篩選條件後執行 fetchProducts()
	useEffect(() => {
		if (user?.role === 'shop') {
			axios
				.get('http://localhost:3005/api/product/shopId', {
					params: { userId: user.id },
				})
				.then((response) => {
					setShopData(response.data);
					console.log('res.data:', response.data);

					const newCriteria = {
						...filterCriteria,
						shopId: response.data.id,
						isDeleted: 0,
					};
					setFilterCriteria(newCriteria);
					fetchProducts(newCriteria);
				})
				.catch((error) => console.error('Error fetching product_class:', error));
		} else if (user?.role === 'admin') {
			const newCriteria = {
				...filterCriteria,
				isDeleted: '',
			};
			setFilterCriteria(newCriteria);
			fetchProducts(newCriteria);
		}
	}, [user]);

	// ============================頁籤篩選功能==============================
	const tabs = [
		{ key: '', label: '全部' },
		{ key: '1', label: '已上架商品' },
		{ key: '0', label: '已下架商品' },
	];

	// ============================換頁功能==============================
	// 計算當前頁顯示的卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentPageProducts = products.slice(startIndex, endIndex);
	// 計算總頁數
	const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

	// ============================啟用狀態切換==============================
	const handleToggleClick = async (productId) => {
		try {
			const response = await axios.post(`http://localhost:3005/api/product/toggleAvailable`, {
				productId,
			});
			const isAvailable = response.data.available;

			setProducts((prevProducts) =>
				prevProducts.map((product) =>
					product.id === productId ? { ...product, available: isAvailable } : product
				)
			);
		} catch (error) {
			console.error('Error toggling favorite:', error);
		}
	};

	// =====================依角色判斷是否可以新增商品===================
	const router = useRouter();
	const handleAddButtonClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		if (user.role !== 'shop') {
			// 用戶角色不符合條件，顯示警告訊息
			Swal.fire({
				title: '無法新增商品',
				text: '只有店家帳號才能新增商品。',
				icon: 'error',
				confirmButtonText: '確認',
			});
			return;
		}

		// 用戶角色符合條件，顯示確認對話框
		Swal.fire({
			title: '確定要新增商品嗎？',
			text: '將進入商品新增頁面。',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '確認',
			cancelButtonText: '取消',
		}).then((result) => {
			if (result.isConfirmed) {
				// 跳轉到新增商品頁面
				router.push('/admin/Products/createProduct');
			}
		});
	};

	// ============================篩選觸發控制==============================
	// AdminTab 點擊時手動觸發
	const handleTabChange = (key) => {
		const newCriteria = { ...filterCriteria, availability: key, search: searchKeyword };
		setFilterCriteria(newCriteria);
		fetchProducts(newCriteria);
	};

	// 搜尋時手動觸發
	const handleSearch = () => {
		const newCriteria = { ...filterCriteria, search: searchKeyword };
		setFilterCriteria(newCriteria);
		fetchProducts(newCriteria);
	};

	return (
		<>
			<AdminLayout
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => setCurrentPage(page)}
			>
				<div className="d-flex justify-content-between">
					<SearchBar
						keyword={searchKeyword}
						onKeywordChange={handleSearchKeywordChange}
						handleSearchChange={handleSearch}
						onRecover={handleClearSearch}
					/>

					<div className="d-flex gap-3">
						{user?.role === 'admin' && (
							<>
								<FormControl sx={{ width: '400px', height: '100%' }}>
									<InputLabel
										id="select-label"
										sx={{
											color: '#fe6f67', // 預設顏色
											'&.Mui-focused': {
												color: '#fe6f67', // 聚焦時顏色
											},
										}}
										shrink={true}
									>
										店家
									</InputLabel>
									<Select
										label="店家"
										id="select-label"
										value={filterCriteria.shopId || ''}
										onChange={(e) => {
											handleChangeFilterCriteria('shopId', e.target.value);
										}}
										displayEmpty
										MenuProps={{
											disableScrollLock: true, // 禁用滾動條鎖定
										}}
										sx={{
											backgroundColor: '#ffffff',
											height: '40px',
											color: '#fe6f67',
											'& .MuiOutlinedInput-notchedOutline': {
												borderColor: '#fe6f67', // 預設外框顏色
											},
											'&:hover .MuiOutlinedInput-notchedOutline': {
												borderColor: '#fe6f67', // 滑鼠懸停外框顏色
											},
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												minWidth: 120,
												borderColor: '#fe6f67', // 聚焦時的外框顏色
											},
											'& .MuiSelect-icon': {
												backgroundImage: `url('/icon/select_arrow.svg')`, // 指定自訂箭頭的 SVG 圖片
												backgroundSize: 'contain',
												backgroundRepeat: 'no-repeat',
												width: '20px',
												height: '20px',
												color: 'transparent', // 隱藏預設顏色
												transition: 'transform 0.3s',
												position: 'absolute', // 固定位置
												right: '15px', // 調整左右位置
												top: '44%', // 垂直居中
												transform: 'translateY(-20%)',
											},
											'& .MuiSelect-iconOpen': {
												transform: 'translateY(-50%) scaleY(-1)', // 展開狀態，垂直居中並旋轉 180 度
											},
										}}
									>
										<MenuItem value="" sx={{ color: '#fe6f67' }}>
											所有店家
										</MenuItem>

										{shops &&
											shops.length > 0 &&
											shops.map((shop) => (
												<MenuItem
													key={shop.id}
													value={shop.id}
													sx={{ color: '#747474' }}
												>
													{shop.name}
												</MenuItem>
											))}
									</Select>
								</FormControl>

								<FormControl sx={{ width: 181, height: '100%' }}>
									<InputLabel
										id="select-label"
										sx={{
											color: '#fe6f67', // 預設顏色
											'&.Mui-focused': {
												color: '#fe6f67', // 聚焦時顏色
											},
										}}
										shrink={true}
									>
										刪除
									</InputLabel>
									<Select
										label="刪除"
										id="select-label"
										value={filterCriteria.isDeleted || ''}
										onChange={(e) => {
											handleChangeFilterCriteria('isDeleted', e.target.value);
										}}
										displayEmpty
										MenuProps={{
											disableScrollLock: true, // 禁用滾動條鎖定
										}}
										sx={{
											backgroundColor: '#ffffff',
											height: '40px',
											color: '#fe6f67',
											'& .MuiOutlinedInput-notchedOutline': {
												borderColor: '#fe6f67', // 預設外框顏色
											},
											'&:hover .MuiOutlinedInput-notchedOutline': {
												borderColor: '#fe6f67', // 滑鼠懸停外框顏色
											},
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												minWidth: 120,
												borderColor: '#fe6f67', // 聚焦時的外框顏色
											},
											'& .MuiSelect-icon': {
												backgroundImage: `url('/icon/select_arrow.svg')`, // 指定自訂箭頭的 SVG 圖片
												backgroundSize: 'contain',
												backgroundRepeat: 'no-repeat',
												width: '20px',
												height: '20px',
												color: 'transparent', // 隱藏預設顏色
												transition: 'transform 0.3s',
												position: 'absolute', // 固定位置
												right: '15px', // 調整左右位置
												top: '44%', // 垂直居中
												transform: 'translateY(-20%)',
											},
											'& .MuiSelect-iconOpen': {
												transform: 'translateY(-50%) scaleY(-1)', // 展開狀態，垂直居中並旋轉 180 度
											},
										}}
									>
										<MenuItem value="" sx={{ color: '#fe6f67' }}>
											不限
										</MenuItem>
										<MenuItem value="0" sx={{ color: '#fe6f67' }}>
											未刪除
										</MenuItem>
										<MenuItem value="1" sx={{ color: '#fe6f67' }}>
											已刪除
										</MenuItem>
									</Select>
								</FormControl>
							</>
						)}

						<FormControl sx={{ width: 181, height: '100%' }}>
							<InputLabel
								id="select-label"
								sx={{
									color: '#fe6f67', // 預設顏色
									'&.Mui-focused': {
										color: '#fe6f67', // 聚焦時顏色
									},
								}}
								shrink={true}
							>
								排序
							</InputLabel>
							<Select
								label="排序"
								id="select-label"
								value={filterCriteria.order || ''}
								onChange={(e) => {
									handleChangeFilterCriteria('order', e.target.value);
								}}
								displayEmpty
								MenuProps={{
									disableScrollLock: true, // 禁用滾動條鎖定
								}}
								sx={{
									backgroundColor: '#ffffff',
									height: '40px',
									color: '#fe6f67',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67', // 預設外框顏色
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#fe6f67', // 滑鼠懸停外框顏色
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										minWidth: 120,
										borderColor: '#fe6f67', // 聚焦時的外框顏色
									},
									'& .MuiSelect-icon': {
										backgroundImage: `url('/icon/select_arrow.svg')`, // 指定自訂箭頭的 SVG 圖片
										backgroundSize: 'contain',
										backgroundRepeat: 'no-repeat',
										width: '20px',
										height: '20px',
										color: 'transparent', // 隱藏預設顏色
										transition: 'transform 0.3s',
										position: 'absolute', // 固定位置
										right: '15px', // 調整左右位置
										top: '44%', // 垂直居中
										transform: 'translateY(-20%)',
									},
									'& .MuiSelect-iconOpen': {
										transform: 'translateY(-50%) scaleY(-1)', // 展開狀態，垂直居中並旋轉 180 度
									},
								}}
							>
								<MenuItem value="" sx={{ color: '#fe6f67' }}>
									依編號
								</MenuItem>
								<MenuItem value="priceDecrease" sx={{ color: '#fe6f67' }}>
									價格較高
								</MenuItem>
								<MenuItem value="priceIncrease" sx={{ color: '#fe6f67' }}>
									價格較低
								</MenuItem>
								<MenuItem value="Earlier" sx={{ color: '#fe6f67' }}>
									新增時間較早
								</MenuItem>
								<MenuItem value="Later" sx={{ color: '#fe6f67' }}>
									新增時間較晚
								</MenuItem>
							</Select>
						</FormControl>
						{/* 包裝 AddButton 以利自定義點擊事件 */}
						<div onClick={handleAddButtonClick}>
							<AddButton />
						</div>
					</div>
				</div>
				<div style={{ paddingBottom: '20px', height: '100%' }}>
					<AdminTab
						tabs={tabs}
						activeTab={filterCriteria.availability}
						setActiveTab={handleTabChange}
					/>
					<div style={{ overflowY: 'auto', height: '86%' }}>
						<table className={`${styles['table']} w-100 mb-3`}>
							<thead className="text-center">
								<tr>
									<th>編號</th>
									<th>照片</th>
									<th>品名</th>
									<th>價格</th>
									{user?.role === 'admin' ? <th>商店</th> : <></>}
									<th>分類</th>
									<th>描述</th>
									<th>關鍵字</th>
									{user?.role === 'admin' && <th>刪除</th>}
									<th>折扣</th>
									<th>庫存</th>
									<th>上架</th>
									<th>操作</th>
								</tr>
							</thead>

							<tbody>
								{currentPageProducts.map((product) => {
									return (
										<tr key={product.id} className="text-center align-middle ">
											<td className={`${styles['table-id']} px-1`}>
												{product.id}
											</td>
											<td className={`${styles['table-photo']}`}>
												<div className={`${styles['photoContainer']}`}>
													<Image
														alt=""
														className={`${styles['photo']}`}
														src={`/photos/products/${product.file_name}`}
														fill
													/>
												</div>
											</td>
											<td className={`${styles['table-name']} px-1`}>
												{product.name}
											</td>
											<td className={`${styles['table-price']} px-1`}>
												{product.price}
											</td>
											{user?.role === 'admin' ? (
												<td className={`${styles['table-shop']} px-1`}>
													{product.shop_name}
												</td>
											) : (
												<></>
											)}
											<td className={`${styles['table-class']} px-1`}>
												{product.class_name}
											</td>
											<td className={`${styles['table-descriptions']} px-2`}>
												{!product.description
													? ''
													: product.description.length <= 70
													? product.description
													: product.description.slice(0, 67) + ' ...'}
											</td>
											<td className={`${styles['table-keywords']}`}>
												{product.keywords}
											</td>
											{user?.role === 'admin' && (
												<td className={`${styles['table-deleted']} px-1`}>
													{product.deleted === 1 && (
														<span className="text-secondary">
															已刪除
														</span>
													)}
													{product.deleted === 0 && (
														<span className="text-success">未刪除</span>
													)}
												</td>
											)}
											<td className={`${styles['table-discount']} px-1`}>
												{product.discount}
											</td>
											<td className={`${styles['table-stocks']} px-1`}>
												{product.stocks}
											</td>
											<td className={`${styles['table-toggle']} px-1`}>
												<div className="d-flex gap-2 justify-content-end pe-2">
													<ToggleButton
														onClick={() => {
															handleToggleClick(product.id);
														}}
														isActive={product.available == 1}
													/>
												</div>
											</td>
											<td className={`${styles['table-edit']}`}>
												<div className="d-flex gap-2 justify-content-end pe-2">
													<Link
														href={`./Products/viewProduct/${product.id}`}
													>
														<ViewButton />
													</Link>
													<Link
														href={`./Products/editProduct/${product.id}`}
													>
														<EditButton />
													</Link>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{products.length === 0 && (
							<div className="w-100 h-75 d-flex justify-content-center align-items-center">
								<h1 className="text-center fw-light text-secondary">
									無此條件的商品
								</h1>
							</div>
						)}
					</div>

					{/* {products.length > ITEMS_PER_PAGE && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={(page) => setCurrentPage(page)}
							changeColor="#fe6f67"
						/>
					)} */}
				</div>
			</AdminLayout>
		</>
	);
}

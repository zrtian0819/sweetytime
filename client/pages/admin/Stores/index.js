import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Styles from '@/styles/adminShop.module.scss';
import Pagination from '@/components/pagination';
import Image from 'next/image';
import axios from 'axios';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import AddButton from '@/components/adminCRUD/addButton';
import ViewButton from '@/components/adminCRUD/viewButton';
import AdminTab from '@/components/adminTab';
import AdminSearch from '@/components/adminSearch';
import Link from 'next/link';

export default function Shop() {
	const ITEMS_PER_PAGE = 5;
	const [allShops, setAllShops] = useState([]); // 原始商家資料
	const [keyword, setKeyword] = useState(''); // keyword值
	const [filteredShops, setFilteredShops] = useState([]); // 篩選後的商家資料
	const [currentPage, setCurrentPage] = useState(1); // 分頁
	const [selectedStatus, setSelectedStatus] = useState('all'); //狀態標籤頁
	const [shopStatus, setShopStatus] = useState({}); //商家啟用停用
	const [clearBtn, setClearBtn] = useState(false); //搜尋框的清除按鈕

	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'open', label: '已啟用商家' },
		{ key: 'close', label: '已關閉商家' },
	];

	useEffect(() => {
		axios
			.get('http://localhost:3005/api/shop')
			.then((response) => {
				const shopData = response.data;
				setAllShops(shopData); // 儲存初始資料
				setFilteredShops(shopData); // 初始顯示所有商家

				const initialStatus = {};
				shopData.forEach((shop) => {
					initialStatus[shop.id] = shop.activation ? 1 : 0;
				});
				setShopStatus(initialStatus);
			})
			.catch((error) => console.error('Error fetching shops:', error));
	}, []);

	const applyFilters = () => {
		const results = allShops.filter((shop) => {
			// 狀態篩選
			const statusMatch =
				selectedStatus === 'all' ||
				(selectedStatus === 'open' && shopStatus[shop.id] === 1) ||
				(selectedStatus === 'close' && shopStatus[shop.id] === 0);

			// 關鍵字篩選
			const searchMatch =
				!keyword || (shop.name && shop.name.toLowerCase().includes(keyword.toLowerCase()));

			return statusMatch && searchMatch;
		});
		setFilteredShops(results);
	};

	// 當標籤或啟用狀態改變時自動篩選
	useEffect(() => {
		applyFilters();
	}, [selectedStatus, shopStatus]);

	// 按下搜尋按鈕時觸發篩選
	const handleSearchBtn = () => {
		applyFilters();
	};

	// 處理搜尋欄位變化
	const handleKeywordChange = (newKeyword) => {
		setKeyword(newKeyword);
		setClearBtn(newKeyword.length > 0);
	};

	//清除按鈕的執行
	const onRecover = () => {
		setKeyword('');
		setClearBtn(false);
		setSelectedStatus('all');
		setFilteredShops(allShops);
	};

	// 切換啟用/停用狀態
	const toggleActivation = async (shopId) => {
		try {
			const response = await axios.put(`http://localhost:3005/api/shop/${shopId}`);
			const { newStatus } = response.data;

			setShopStatus((prevStatus) => ({
				...prevStatus,
				[shopId]: newStatus,
			}));
		} catch (error) {
			console.error('Failed to toggle activation:', error);
			alert('更新失敗，請重試');
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentShops = filteredShops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);

	return (
		<AdminLayout>
			<div className={`${Styles['TIL-ShopPage']} mt-4`}>
				<div className={Styles['TIl-nav']}>
					<div className="d-flex flex-row justify-content-between pe-3">
						<AdminSearch
							keyword={keyword}
							onKeywordChange={handleKeywordChange}
							handleSearchChange={handleSearchBtn}
							onRecover={clearBtn ? onRecover : null}
						/>
						<AddButton />
					</div>
					<AdminTab
						tabs={tabs}
						activeTab={selectedStatus}
						setActiveTab={setSelectedStatus}
					/>
				</div>
				<div className="container-fluid">
					<table className={`${Styles['TIL-ShopTable']} w-100`}>
						<thead className={`${Styles['TIL-title']} text-center`}>
							<tr className={`${Styles['TIL-row']} row`}>
								<th className="col-1">ID</th>
								<th className="col-1">店家名稱</th>
								<th className="col-1">Logo</th>
								<th className="col-1">電話</th>
								<th className="col-2">地址</th>
								<th className="col-3">描述</th>
								<th className="col-1">註冊時間</th>
								<th className="col-1">啟用</th>
								<th className="col-1">操作</th>
							</tr>
						</thead>
						<tbody>
							{currentShops.map((shop) => (
								<tr
									key={shop.id}
									className="row text-center"
									style={{ height: '100px' }}
								>
									<td className={`${Styles['TIL-content']} col-1 p-0`}>
										{shop.id}
									</td>
									<td className={`${Styles['TIL-content']} col-1 p-0`}>
										{shop.name}
									</td>
									<td className={`${Styles['TIL-content']} col-1 p-0`}>
										<Image
											src={`/photos/shop_logo/${shop.logo_path}`}
											alt={shop.name}
											width={50}
											height={50}
											className={Styles['TIL-ShopImage']}
										/>
									</td>
									<td className={`${Styles['TIL-content']} col-1 p-0`}>
										{shop.phone}
									</td>
									<td className={`${Styles['TIL-content']} col-2`}>
										{shop.address}
									</td>
									<td className={`${Styles['TIL-content']} col-3`}>
										<div className={`${Styles['TIL-description']} text-start`}>
											{shop.description}
										</div>
									</td>
									<td className={`${Styles['TIL-content']} col-1 p-0`}>
										{shop.sign_up_time}
									</td>
									<td className={`${Styles['TIL-content']} col-1 p-0`}>
										<ToggleButton
											isActive={shopStatus[shop.id] === 1}
											onClick={() => toggleActivation(shop.id)}
										/>
									</td>
									<td className={`${Styles['TIL-content']} col-1 gap-2`}>
										<Link href={'./Stores/viewStores'}>
											<ViewButton />
										</Link>
										<Link href={'./Stores/editStores'}>
											<EditButton />
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</div>
		</AdminLayout>
	);
}

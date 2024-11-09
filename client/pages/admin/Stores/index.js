import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Styles from '@/styles/adminShop.module.scss';
import Image from 'next/image';
import axios from 'axios';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import AddButton from '@/components/adminCRUD/addButton';
import ViewButton from '@/components/adminCRUD/viewButton';
import AdminTab from '@/components/adminTab';
import AdminSearch from '@/components/adminSearch';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function Shop() {
	const ITEMS_PER_PAGE = 5;
	const [allShops, setAllShops] = useState([]); // 原始商家資料
	const [keyword, setKeyword] = useState(''); // keyword值
	const [filteredShops, setFilteredShops] = useState([]); // 篩選後的商家資料
	const [currentPage, setCurrentPage] = useState(1); // 分頁
	const [selectedStatus, setSelectedStatus] = useState('all'); //狀態標籤頁
	const [shopStatus, setShopStatus] = useState({}); //商家啟用停用

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
	};

	useEffect(() => {
		if (filteredShops.length === 0 && keyword) {
			Swal.fire({
				title: `找不到與"${keyword}"相關的店家`,
				text: '請嘗試其他關鍵字或篩選條件',
				icon: 'warning',
			});
			setKeyword('');
			setFilteredShops(allShops);
			return;
		}
	}, [filteredShops, keyword]);

	//清除按鈕的執行
	const onRecover = () => {
		setKeyword('');
		setSelectedStatus('all');
	};

	// 每次切換標籤時重設到第一頁
	const handleTabChange = (status) => {
		setSelectedStatus(status);
		setCurrentPage(1);
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

			//幾秒後切換標籤頁
			setTimeout(() => {
				if (selectedStatus === 'open' && newStatus === 0) {
					handleTabChange('close');
				} else if (selectedStatus === 'close' && newStatus === 1) {
					handleTabChange('open');
				}
			}, 500);
		} catch (error) {
			console.error('Failed to toggle activation:', error);
			alert('更新失敗，請重試');
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentShops = filteredShops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);

	return (
		<AdminLayout
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={(page) => setCurrentPage(page)}
		>
			<div className={Styles['TIL-ShopPage']}>
				<div className={Styles['TIl-nav']}>
					<div className="d-flex flex-row justify-content-between pe-3">
						<AdminSearch
							keyword={keyword}
							onKeywordChange={handleKeywordChange}
							handleSearchChange={handleSearchBtn}
							onRecover={onRecover}
						/>
						<AddButton href={'./Stores/creatStores'} />
					</div>
					<AdminTab
						tabs={tabs}
						activeTab={selectedStatus}
						setActiveTab={handleTabChange}
					/>
				</div>
				<div className={Styles['table-container']}>
					<div className={Styles['table-header']}>
						<div className={Styles['table-cell']}>ID</div>
						<div className={Styles['table-cell']}>店家名稱</div>
						<div className={Styles['table-cell']}>Logo</div>
						<div className={Styles['table-cell']}>電話</div>
						<div className={Styles['table-cell']}>地址</div>
						<div className={Styles['table-cell']}>簡介</div>
						<div className={Styles['table-cell']}>註冊時間</div>
						<div className={Styles['table-cell']}>啟用</div>
						<div className={Styles['table-cell']}>操作</div>
					</div>
					{currentShops.map((shop) => (
						<div className={Styles['table-row']} key={shop.id}>
							<div className={Styles['table-cell']}>{shop.id}</div>
							<div className={Styles['table-cell']}>{shop.name}</div>
							<div className={Styles['table-cell']}>
								<Image
									src={`/photos/shop_logo/${shop.logo_path}`}
									alt={shop.name}
									width={100}
									height={100}
									className={Styles['TIL-image']}
								/>
							</div>
							<div className={Styles['table-cell']}>{shop.phone}</div>
							<div className={Styles['table-cell']}>{shop.address}</div>
							<div className={`${Styles['table-cell']} ${Styles['TIL-description']}`}>
								<span>{shop.description}</span>
							</div>
							<div className={Styles['table-cell']}>{shop.sign_up_time}</div>
							<div className={Styles['table-cell']}>
								<ToggleButton
									isActive={shopStatus[shop.id] === 1}
									onClick={() => toggleActivation(shop.id)}
								/>
							</div>
							<div className={`${Styles['table-cell']} gap-2`}>
								<Link href={`./Stores/viewStores/${shop.id}`}>
									<ViewButton />
								</Link>
								<Link href={`./Stores/editStores/${shop.id}`}>
									<EditButton />
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	);
}

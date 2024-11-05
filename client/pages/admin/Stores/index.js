import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Styles from '@/styles/adminShop.module.scss';
import Pagination from '@/components/pagination';
import Image from 'next/image';
import axios from 'axios';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import ViewButton from '@/components/adminCRUD/viewButton';
import AdminTab from '@/components/adminTab';
import AdminSearch from '@/components/adminSearch';
import { IoMdAdd } from 'react-icons/io';

export default function Shop() {
	const ITEMS_PER_PAGE = 5;
	const [searchShop, setSearchShop] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState('全部');
	const [filteredShops, setFilteredShops] = useState([]);
	const [shopStatus, setShopStatus] = useState({});

	const tabs = [
		{ key: 'all', label: '全部', content: '全部的商家清單' },
		{ key: 'open', label: '已啟用商家', content: '目前啟用中的商家名單' },
		{ key: 'close', label: '已關閉商家', content: '已關閉的商家名單' },
	];

	// 獲取商家列表並初始化 shopStatus 狀態
	useEffect(() => {
		axios
			.get('http://localhost:3005/api/shop')
			.then((response) => {
				const shopData = response.data;
				console.log('Shop data:', shopData);
				setFilteredShops(shopData);

				// 初始化 shopStatus
				const initialStatus = {};
				shopData.forEach((shop) => {
					initialStatus[shop.id] = shop.activation ? 1 : 0;
				});
				setShopStatus(initialStatus);
			})
			.catch((error) => console.error('Error fetching shops:', error));
	}, []);

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
					<div className="d-flex flex-row justify-content-between">
						<AdminSearch
							text="搜尋商家"
							searchShop={searchShop}
							setSearchShop={setSearchShop}
						/>
						<div className="pe-2">
							<IoMdAdd className={Styles['TIL-add']} />
						</div>
					</div>
					<AdminTab
						tabs={tabs}
						selectedStatus={selectedStatus}
						setSelectedStatus={setSelectedStatus}
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
									<td className={`${Styles['TIL-content']} col-2 `}>
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
										<ViewButton />
										<EditButton />
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

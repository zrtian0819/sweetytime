import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import styles from '@/styles/adminShop.module.scss';
import Pagination from '@/components/pagination';
import StatusTabs from '@/components/adminShop/StatusTabs';
import SearchBar from '@/components/adminShop/SearchBar';
import { FaEye, FaEdit, FaToggleOn } from 'react-icons/fa';
import Image from 'next/image';
import axios from 'axios';
import { Link } from 'lucide-react';

export default function Shop() {
	const ITEMS_PER_PAGE = 5;
	const [searchShop, setSearchShop] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState('全部');
	const [filteredShops, setFilteredShops] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:3005/api/shop')
			.then((response) => {
				setFilteredShops(response.data);
			})
			.catch((error) => console.error('Error fetching users:', error));
	}, []);

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentShops = filteredShops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);

	return (
		<AdminLayout>
			<div className={styles['TIL-ShopPage']}>
				<SearchBar searchShop={searchShop} setSearchShop={setSearchShop} />
				<StatusTabs selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
				<div className="container-fluid">
					<table className={`${styles['TIL-ShopTable']} w-100`}>
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
									<td className={`${styles['TIL-content']} col-1`}>{shop.id}</td>
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
										<button className={styles['TIL-actionButton']}>
											<FaEye />
										</button>
										<button className={styles['TIL-actionButton']}>
											<FaEdit />
										</button>
										<button className={styles['TIL-actionButton']}>
											<FaToggleOn />
										</button>
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

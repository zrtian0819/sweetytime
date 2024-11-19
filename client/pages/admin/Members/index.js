import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import AdminTab from '@/components/adminTab';
import styles from '@/styles/adminUser.module.scss';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/adminSearch';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import SwalDetails from '@/components/userSwal';
import notFound from '@/components/sweetAlert/notFound';
import 'animate.css';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const UserAdmin = () => {
	const router = useRouter();
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [activeTab, setActiveTab] = useState('all');
	const [userStatus, setUserStatus] = useState({});

	const tabs = [
		{ key: 'all', label: '全部' },
		{ key: 'active', label: '已啟用帳號' },
		{ key: 'inactive', label: '已停用帳號' },
	];

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const res = await axios.get('http://localhost:3005/api/user/regular-users');
			const data = res.data;

			const initialStatus = {};
			data.forEach((user) => {
				initialStatus[user.id] = parseInt(user.activation);
			});

			setUserStatus(initialStatus);
			setUsers(data);
			setFilteredUsers(data);
		} catch (error) {
			console.error('無法獲取用戶資料:', error);
		}
	};

	useEffect(() => {
		if (router.query.reload) {
			fetchUsers();
		}
	}, [router.query]);

	const applyFilters = () => {
		const filtered = users.filter((user) => {
			const statusMatch =
				activeTab === 'all' ||
				(activeTab === 'active' && userStatus[user.id] === 1) ||
				(activeTab === 'inactive' && userStatus[user.id] === 0);

			const searchMatch =
				!searchTerm ||
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());

			return statusMatch && searchMatch;
		});
		setFilteredUsers(filtered);
		setCurrentPage(1);
	};

	//not found
	useEffect(() => {
		if (filteredUsers.length === 0 && searchTerm) {
			notFound({
				title: `找不到與"${searchTerm}"相關的會員`,
				text: '請嘗試其他關鍵字或篩選條件',
			});

			setSearchTerm('');
			setFilteredUsers(users);
			return;
		}
	}, [filteredUsers, searchTerm]);

	//

	useEffect(() => {
		applyFilters();
	}, [activeTab, users]);

	const handleToggleClick = async (userId) => {
		const newStatus = userStatus[userId] === 1 ? 0 : 1;
		try {
			await axios.put(`http://localhost:3005/api/user/${userId}/toggleStatus`, {
				activation: newStatus, // 確保傳遞 activation 新狀態
			});
			setUserStatus((prevStatus) => ({
				...prevStatus,
				[userId]: newStatus,
			}));
			applyFilters();
		} catch (error) {
			console.error('更新用戶狀態失敗:', error);
			alert('更新失敗，請重試');
		}
	};

	const handleSearchChange = (newKeyword) => {
		setSearchTerm(newKeyword);
	};
	const handleSearchBtn = () => {
		applyFilters();
	};
	const onRecover = () => {
		setSearchTerm('');
		setActiveTab('all');
		setFilteredUsers(users);
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<AdminLayout
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={(page) => setCurrentPage(page)}
		>
			<div className={styles.adminUserPage}>
				<div className={styles.searchBarContainer}>
					<SearchBar
						keyword={searchTerm}
						onKeywordChange={handleSearchChange}
						handleSearchChange={handleSearchBtn}
						onRecover={onRecover}
					/>
				</div>
				<AdminTab tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />

				<div style={{ overflowY: 'scroll', maxHeight: '86%' }}>
					<table className={styles.adminUserTable}>
						<thead className={styles.adminUserTitle}>
							<tr>
								<th>ID</th>
								<th>圖片</th>
								<th>帳號</th>
								<th>名稱</th>
								<th>電話</th>
								<th>電子郵件</th>
								<th>啟用</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{currentUsers.map((user, index) => (
								<tr key={user.id}>
									<td>{startIndex + index + 1}</td>
									<td>
										<img
											src={`/photos/user/${user.portrait_path}`}
											alt={user.name}
											className={styles.adminUserImage}
										/>
									</td>
									<td>{user.account}</td>
									<td>{user.name}</td>
									<td>{user.phone || '-'}</td>
									<td>{user.email || '-'}</td>
									<td>
										<div className="d-flex gap-3 justify-content-center">
											<ToggleButton
												isActive={userStatus[user.id] === 1}
												onClick={() => handleToggleClick(user.id)}
											/>
										</div>
									</td>
									<td>
										<div className="d-flex gap-3 justify-content-center">
											<ViewButton onClick={() => setSelectedUser(user)} />
											<Link href={`/admin/Members/editUser/${user.id}`}>
												<EditButton />
											</Link>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{selectedUser && (
					<SwalDetails
						userView={{
							id: selectedUser.id,
							account: selectedUser.account,
							name: selectedUser.name,
							phone: selectedUser.phone,
							email: selectedUser.email,
							birthday: selectedUser.birthday,
							status: userStatus[selectedUser.id],
							portrait_path: selectedUser.portrait_path,
						}}
						onClose={() => setSelectedUser(null)}
					/>
				)}
			</div>
		</AdminLayout>
	);
};

export default UserAdmin;

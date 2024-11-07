import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Styles from '@/styles/adminUser.module.scss';
import Pagination from '@/components/pagination';
import AdminTab from '@/components/adminTab';
import AdminSearch from '@/components/adminSearch';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import ViewButton from '@/components/adminCRUD/viewButton';
import Link from 'next/link';
import axios from 'axios';

export default function Users() {
    const ITEMS_PER_PAGE = 5;
    const [allUsers, setAllUsers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [userStatus, setUserStatus] = useState({});
    const [clearBtn, setClearBtn] = useState(false);

    const tabs = [
        { key: 'all', label: '全部' },
        { key: 'active', label: '已啟用帳號' },
        { key: 'inactive', label: '已停用帳號' },
    ];

    // 格式化日期
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-TW');
    };

    useEffect(() => {
        axios
            .get('http://localhost:3005/api/user/regular-users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // 加入驗證token
                }
            })
            .then((response) => {
                console.log('API Response:', response.data); // 偵錯用
                const userData = response.data;
                setAllUsers(userData);
                setFilteredUsers(userData);

                const initialStatus = {};
                userData.forEach((user) => {
                    initialStatus[user.id] = user.activation ? 1 : 0;
                });
                setUserStatus(initialStatus);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                if (error.response) {
                    console.log('Error response:', error.response.data); // 偵錯用
                }
            });
    }, []);

    const applyFilters = () => {
        const results = allUsers.filter((user) => {
            const statusMatch =
                selectedStatus === 'all' ||
                (selectedStatus === 'active' && userStatus[user.id] === 1) ||
                (selectedStatus === 'inactive' && userStatus[user.id] === 0);

            const searchMatch =
                !keyword || 
                (user.name && user.name.toLowerCase().includes(keyword.toLowerCase())) ||
                (user.account && user.account.toLowerCase().includes(keyword.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(keyword.toLowerCase()));

            return statusMatch && searchMatch;
        });
        setFilteredUsers(results);
    };

    useEffect(() => {
        applyFilters();
    }, [selectedStatus, userStatus, keyword]);

    const handleSearchBtn = () => {
        applyFilters();
    };

    const handleKeywordChange = (newKeyword) => {
        setKeyword(newKeyword);
        setClearBtn(newKeyword.length > 0);
    };

    const onRecover = () => {
        setKeyword('');
        setClearBtn(false);
        setSelectedStatus('all');
        setFilteredUsers(allUsers);
    };

    const toggleActivation = async (userId) => {
        try {
            const response = await axios.put(
                `http://localhost:3005/api/user/${userId}/toggle`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            const { newStatus } = response.data;

            setUserStatus((prevStatus) => ({
                ...prevStatus,
                [userId]: newStatus,
            }));
        } catch (error) {
            console.error('Failed to toggle activation:', error);
            alert('更新失敗，請重試');
        }
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    return (
        <AdminLayout>
            <div className={`${Styles['TIL-UserPage']} mt-4`}>
                <div className={Styles['TIl-nav']}>
                    <div className="d-flex flex-row justify-content-between pe-3">
                        <AdminSearch
                            keyword={keyword}
                            onKeywordChange={handleKeywordChange}
                            handleSearchChange={handleSearchBtn}
                            onRecover={clearBtn ? onRecover : null}
                        />
                    </div>
                    <AdminTab
                        tabs={tabs}
                        activeTab={selectedStatus}
                        setActiveTab={setSelectedStatus}
                    />
                </div>
                <div className="container-fluid">
                    <table className={`${Styles['TIL-UserTable']} w-100`}>
                        <thead className={`${Styles['TIL-title']} text-center`}>
                            <tr className={`${Styles['TIL-row']} row`}>
                                <th className="col-1">ID</th>
                                <th className="col-2">帳號</th>
                                <th className="col-1">姓名</th>
                                <th className="col-2">Email</th>
                                <th className="col-1">電話</th>
                                <th className="col-1">性別</th>
                                <th className="col-1">生日</th>
                                <th className="col-1">角色</th>
                                <th className="col-1">啟用</th>
                                <th className="col-1">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="row text-center align-items-center"
                                >
                                    <td className={`${Styles['TIL-content']} col-1`}>
                                        {user.id}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-2`}>
                                        {user.account || '-'}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-1`}>
                                        {user.name || '-'}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-2`}>
                                        {user.email || '-'}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-1`}>
                                        {user.phone || '-'}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-1`}>
                                        {user.gender || '-'}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-1`}>
                                        {formatDate(user.birthday)}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-1`}>
                                        {user.role || 'user'}
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-1`}>
                                        <ToggleButton
                                            isActive={userStatus[user.id] === 1}
                                            onClick={() => toggleActivation(user.id)}
                                        />
                                    </td>
                                    <td className={`${Styles['TIL-content']} col-1 gap-2`}>
                                        <Link href={`./Users/viewUser/${user.id}`}>
                                            <ViewButton />
                                        </Link>
                                        <Link href={`./Users/editUser/${user.id}`}>
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
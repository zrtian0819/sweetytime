// 引入必要的 React 相關套件
import React from 'react';
import Link from 'next/link'; // Next.js 的路由連結元件
import styles from './admin-sidebar.module.scss'; // 引入 SCSS 模組樣式
import { useUser } from '@/context/userContext'; // 引入使用者 Context

// 引入 Lucide React 的圖示元件
import {
	Home,
	Users,
	GraduationCap,
	BookOpen,
	ShoppingBag,
	Store,
	Newspaper,
	ClipboardList,
} from 'lucide-react';

// 管理員側邊欄元件
const AdminSidebar = () => {
	// 從 Context 中獲取使用者資訊
	const { user } = useUser();

	// 根據使用者角色獲取對應的選單項目
	const getMenuItems = (userRole) => {
		// 定義基礎選單項目（所有角色都可見）
		const baseItems = [
			{ name: 'Home', path: '/admin', icon: <Home size={20} /> },
			{ name: 'Products', path: '/admin/Products', icon: <ShoppingBag size={20} /> },
		];

		// 如果是管理員角色，添加額外的選單項目
		if (userRole === 'admin') {
			return [
				...baseItems,
				{ name: 'Members', path: '/admin/Members', icon: <Users size={20} /> },
        { name: 'Stores', path: '/admin/Stores', icon: <Store size={20} /> },
				{ name: 'Teachers', path: '/admin/Teachers', icon: <GraduationCap size={20} /> },
				{ name: 'Lessons', path: '/admin/Lessons', icon: <BookOpen size={20} /> },
        { name: 'News', path: '/admin/News', icon: <Newspaper size={20} /> },
			];
		}

		// 如果是管理員角色，添加額外的選單項目
		if (userRole === 'shop') {
			return [
				...baseItems,
        { name: 'Orders', path: '/shopBackstage/orders', icon: <ClipboardList size={20} /> },
			];
		}

		// 非管理員角色僅返回基礎選單項目
		return baseItems;
	};

	// 獲取當前使用者可見的選單項目
	const visibleMenuItems = getMenuItems(user?.role);

	// 渲染側邊欄
	return (
		<aside className={styles.sidebar}>
			<ul className={styles.navList}>
				{/* 遍歷並渲染選單項目 */}
				{visibleMenuItems.map((item, index) => (
					<li key={index} className={`${styles.navItem} fw-bold`}>
						<Link href={item.path}>
							<span className={styles.linkContent}>
								{item.icon} {/* 渲染圖示 */}
								<span>{item.name}</span> {/* 渲染選單名稱 */}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</aside>
	);
};

// 匯出元件
export default AdminSidebar;

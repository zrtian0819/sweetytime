import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
	const [favorites, setFavorites] = useState({ lesson: {}, product: {}, shop: {} });

	//在客戶端讀取 localStorage 中的收藏數據
	useEffect(() => {
		const saved = typeof window !== 'undefined' ? localStorage.getItem('favorites') : null;
		if (saved) {
			setFavorites(JSON.parse(saved));
		}
	}, []);

	// 每次 favorites 更新時，同步到 localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('favorites', JSON.stringify(favorites));
		}
	}, [favorites]);

	// 切換收藏狀態的函數
	const toggleFavorite = (type, id) => {
		setFavorites((prevFavorites) => ({
			...prevFavorites,
			[type]: {
				...prevFavorites[type], // 如果 type 不存在則初始化為空對象
				[id]: !prevFavorites[type]?.[id],
			},
		}));
	};

	// 傳遞收藏狀態和切換收藏狀態的函數
	return (
		<FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
			{children}
		</FavoritesContext.Provider>
	);
}

// 自定義 Hook，方便在組件中使用收藏 Context
export function useFavorites() {
	return useContext(FavoritesContext);
}

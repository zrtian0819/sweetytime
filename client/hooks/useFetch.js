//未完成先不要使用

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// 重置狀態
		setLoading(true);
		setError(null);

		const fetchData = async () => {
			try {
				const response = await axios.get(url);
				setData(response.data[0]);
			} catch (err) {
				console.error('Fetch error:', err);
				setError(err.message || '發生錯誤');
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		// 只在 url 存在時執行
		if (url) {
			fetchData();
		} else {
			setLoading(false);
		}

		// 可選：清理函數
		return () => {
			// 組件卸載時可以在這裡做清理工作
			setData(null);
			setError(null);
		};
	}, [url]);

	return { data, loading, error };
};

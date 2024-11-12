// 需要建立一個 callback 頁面，例如在 pages/api/shipment/711.js：
import { useShip711StoreCallback, useShip711StoreOpener } from '@/hooks/use-ship-711-store';
import { useEffect } from 'react';

export default function Callback() {
	const { closeWindow, store711 } = useShip711StoreOpener();

	useEffect(() => {
		if (store711.storeid) {
			closeWindow(); // 建議由 callback 頁面處理關閉
		}
	}, [store711]);

	useShip711StoreCallback('store711');
	return <div>處理中...</div>;
}

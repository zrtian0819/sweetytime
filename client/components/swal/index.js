// Sweetalert2使用方法
// 安裝方式: npm i sweetalert2 sweetalert2-react-content
// npm網址:https://www.npmjs.com/package/sweetalert2

// 說明:
// 為什麼要用 sweetalert2-react-content？
// 方便嵌入 React 元件：
// 1.可以讓你直接將 React 元件放到 SweetAlert2 的內容中，這樣就能夠更靈活地控制彈出視窗的內容。
// 2.增加互動性：可以將表單、按鈕等放在彈出視窗中，讓用戶可以進行互動。
// 3.與 React 狀態整合：可以利用 React 狀態來動態更新彈出視窗的內容。

// 引用方式如下:

// 你可以隨意取你要用的名稱
import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// 初始化 SweetAlert2 with React
const MySwal = withReactContent(Swal);

// 假設你有一個按鈕
const Btn = () => {
	const showAlert = () => {
		MySwal.fire({
			title: '標題',
			text: '訊息',
			icon: 'info', // 圖示
			showCloseButton: true,
			showCancelButton: true,
			focusConfirm: false,
			cancelButtonText: '取消', // 按下確定可以關閉視窗
			confirmButtonText: '確定', //取消按鈕
			reverseButtons: true,
			// 反轉按鈕排列順序 (一般來講是 "是" "否" 會反轉順序 變成"否" "是")
			footer: '<a href="#">這裡是一個點的連結</a>',
		});
	};

	return (
		<button onClick={showAlert} style={{ padding: '10px 20px', fontSize: '16px' }}>
			顯示彈跳式視窗
		</button>
	);
};

export default Btn;

// 更多資訊和範例演示: https://sweetalert2.github.io/

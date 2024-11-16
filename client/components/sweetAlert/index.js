import Swal from 'sweetalert2';
import router from 'next/router';

const sweetAlert = ({ text, confirmButtonText = '返回列表頁', href }) => {
	Swal.fire({
		icon: 'success',
		title: '新增成功！',
		text: text,
		confirmButtonText: confirmButtonText,
		confirmButtonColor: '#fe6f67',
	}).then((result) => {
		if (result.isConfirmed && href) {
			router.push(href);
		}
	});
};
export default sweetAlert;

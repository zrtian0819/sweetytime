import Swal from 'sweetalert2';
import router from 'next/router';

const sweetAlert = ({ title ,text, confirmButtonText = '返回列表頁', href }) => {
	Swal.fire({
		icon: 'success',
		title: title,
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

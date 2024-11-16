import Swal from 'sweetalert2';

const sweetAlert = ({ text, confirmButtonText = '返回列表頁', href }) => {
	Swal.fire({
		icon: 'success',
		title: '新增成功！',
		text: text,
		confirmButtonText: confirmButtonText,
		confirmButtonColor: '#fe6f67',
	}).then((result) => {
		if (result.isConfirmed) {
			window.location.href = href;
		}
	});
};
export default sweetAlert;

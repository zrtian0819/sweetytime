import Swal from 'sweetalert2';

const notFound = ({ title, text }) => {
	Swal.fire({
		title: title,
		text: text,
		icon: 'warning',
		confirmButtonColor: '#fe6f67',
	});
};
export default notFound;

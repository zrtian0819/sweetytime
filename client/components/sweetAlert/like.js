import Swal from 'sweetalert2';

const likeSweet = () => {
	Swal.fire({
		title: '收藏之前，要先登入呀🥰',
		width: 600,
		padding: '3em',
		color: '#fe6f67',
		background: '#ffe6e4',
		backdrop: `
          rgba(0,0,123,0.4)
          url("/photos/sweetAlert2/nyan-cat.gif")
          left top
          no-repeat
        `,
	});
};
export default likeSweet;

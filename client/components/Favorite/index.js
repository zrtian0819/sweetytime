import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function FavoriteButton({ isFavorite, onClick }) {
	return (
		<>
			<div
				onClick={onClick}
				style={{ cursor: 'pointer', fontSize: '30px', color: '#fe6f67' }}
			>
				{isFavorite ? <FaHeart /> : <FaRegHeart />}
			</div>
		</>
	);
}

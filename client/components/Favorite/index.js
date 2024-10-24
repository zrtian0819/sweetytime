import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

export default function Index({ isFavorite, onClick }) {
	return (
		<>
			<FontAwesomeIcon
				onClick={onClick}
				icon={isFavorite ? solidHeart : regularHeart}
				style={{ cursor: 'pointer', fontSize: '20px',color: 'red'}}
			/>
		</>
	);
}

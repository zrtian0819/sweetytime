import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ToggleLike from '@/hooks/toggleLike';

export default function LikeButton({ originalLiked, size }) {
	const { isLiked, handleToggleLike } = ToggleLike(originalLiked);

	return (
		<>
			{isLiked ? (
				<FaHeart
					color="white"
					onClick={handleToggleLike}
					style={{ height: size, width: size }}
				/>
			) : (
				<FaRegHeart
					color="white"
					onClick={handleToggleLike}
					style={{ height: size, width: size }}
				/>
			)}
		</>
	);
}

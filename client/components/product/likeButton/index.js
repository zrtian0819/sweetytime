import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ToggleLike from '@/hooks/toggleLike';

export default function LikeButton({ originalLiked }) {
	const { isLiked, handleToggleLike } = ToggleLike(originalLiked);

	return (
		<>
			{isLiked ? (
				<FaHeart color="white" onClick={handleToggleLike} />
			) : (
				<FaRegHeart color="white" onClick={handleToggleLike} />
			)}
		</>
	);
}

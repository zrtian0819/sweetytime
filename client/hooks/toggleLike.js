import { useState, useCallback } from 'react';

export default function ToggleLike(originalLiked) {
	const [isLiked, setIsLiked] = useState(originalLiked);

	const handleToggleLike = useCallback(() => {
		setIsLiked((prev) => !prev);
	}, []);

	return { isLiked, handleToggleLike };
}

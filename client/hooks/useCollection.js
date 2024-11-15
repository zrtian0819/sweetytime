import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/context/userContext';

const useCollection = (type, id, onRemove) => {
  // 在收藏頁面中，預設為已收藏
  const [isLiked, setIsLiked] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // 不需要檢查收藏狀態的 useEffect，因為在收藏頁面中一定是已收藏

  const toggleLike = async () => {
    if (!user) return;
  
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/${type}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      
      setIsLiked(false);
      onRemove?.(id); // 確保 onRemove 被調用
      return true; // 返回成功狀態
    } catch (error) {
      console.error('Failed to toggle collection:', error);
      return false;
    }
  };

  return { isLiked, toggleLike, loading };
};

export default useCollection;
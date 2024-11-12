import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import axios from 'axios';

export default function LessonCard({ lessonData }) {
    console.log('Lesson 組件收到的數據:', lessonData);

    // 檢查 lessonData 是否存在
    if (!lessonData) {
        console.error('Lesson: lessonData is undefined');
        return null;
    }

    // 解構必要的資料
    const { id, img, name, date, price, des } = lessonData;

    // 檢查必要欄位
    if (!id || !img || !name) {
        console.error('Missing required fields in lessonData:', { id, img, name });
        return null;
    }

    const [isLike, setIsLike] = useState(false);

    // 檢查課程是否已收藏
    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) return;

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/check`,
                    {
                        params: {
                            type: 'lesson',
                            item_id: id,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setIsLike(response.data.isCollected);
            } catch (error) {
                console.error('Failed to check collection status:', error);
            }
        };

        checkIfLiked();
    }, [id]);

    // 處理收藏/取消收藏
    const handleLike = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('User not logged in');
                return;
            }

            if (!isLike) {
                // 添加收藏
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection`,
                    {
                        type: 'lesson',
                        item_id: id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                // 取消收藏
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/lesson/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            setIsLike(!isLike);
        } catch (error) {
            console.error('Failed to toggle collection:', error);
        }
    };

    // 格式化價格顯示
    const formatPrice = (price) => {
        return typeof price === 'number' 
            ? `NT$ ${price.toLocaleString()}`
            : price;
    };

    return (
        <div className={`${Styles['CTH-card']} card m-3`}>
            <div className={`${Styles['CTH-card-top']}`}>
                <Image
                    src={`/photos/lesson/${img}`}
                    width={200}
                    height={200}
                    className={Styles['CTH-lesson-card-img']}
                    alt={name}
                    loading="lazy"
                    onError={(e) => {
                        console.error(`Failed to load image: ${img}`);
                        e.target.src = '/path/to/fallback-image.jpg'; // 設置預設圖片
                    }}
                />
                {isLike ? (
                    <FaHeart
                        className={`${Styles['CTH-lesson-card-icon']}`}
                        size={30}
                        onClick={handleLike}
                    />
                ) : (
                    <FaRegHeart
                        className={Styles['CTH-lesson-card-icon']}
                        size={30}
                        onClick={handleLike}
                    />
                )}
            </div>
            <div className={`${Styles['CTH-card-body']} card-body`}>
                <div className="card-body-left">
                    <h4>{name}</h4>
                    <p>{date}</p>
                    <h4>{formatPrice(price)}</h4>
                </div>
                <div className={`${Styles['CTH-card-body-right']} ms-auto`}>
                    <button className="btn">
                        <FaArrowRightLong size={20} />
                        看更多
                    </button>
                </div>
                <div className={Styles['CTH-hover-content']}>
                    <h4>課程介紹</h4>
                    <p className={Styles['CTH-ellipsis']}>
                        {des ? `${des.slice(0, 35)}...` : '暫無課程介紹'}
                    </p>
                    <Link href={`/lesson/${id}`}>
                        <button className="btn">
                            <FaArrowRightLong size={20} />
                            看更多
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
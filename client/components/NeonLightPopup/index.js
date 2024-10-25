import React, { useState, useEffect } from 'react';
import styles from '../NeonLightPopup/style.module.scss';

const NeonLightPopup = () => {
    // 控制彈窗的開關狀態，預設為開啟
    const [isOpen, setIsOpen] = useState(true);
    // 控制目前顯示的圖片顏色，預設為紅色
    const [currentImage, setCurrentImage] = useState('red');

    useEffect(() => {
        // 只有在彈窗開啟時才設置計時器
        let interval;
        if (isOpen) {
            interval = setInterval(() => {
                setCurrentImage((prev) => prev === 'red' ? 'green' : 'red');
            }, 300);

            document.body.style.overflow = 'hidden';
        }

        return () => {
            // 清理計時器
            if (interval) {
                clearInterval(interval);
            }
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]); // 依賴於 isOpen 狀態

    const closeModal = () => {
        setIsOpen(false);
        // 在關閉時重置圖片狀態
        setCurrentImage('red');
    };

    // 如果彈窗關閉，不渲染任何內容
    if (!isOpen) return null;

    return (
        // 彈窗遮罩層
        <div className={styles["popup-overlay"]}>
            {/* 彈窗容器 */}
            <div className={styles["popup-container"]}>
                {/* 關閉按鈕 */}
                <button
                    onClick={closeModal}
                    className={styles["popup-close-button"]}
                >
                    {/* SVG 關閉圖示 */}
                    <svg 
                        className={styles["close-icon"]} 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                {/* 彈窗內容區域 */}
                <div className={styles["popup-content"]}>
                    {/* 
                      * 霓虹燈圖片
                      * 根據 currentImage 狀態切換紅/綠燈圖片
                      */}
                    <img 
                        src={currentImage === 'red' ? "/vector/neonLightRed.svg" : "/vector/neonLightGreen.svg"}
                        alt={`neon_light_${currentImage}`}
                        className={styles["popup-image"]}
                    />
                </div>
            </div>
        </div>
    );
};

export default NeonLightPopup;
import React, { useState, useEffect } from 'react';
import styles from '../NeonLightPopup/style.module.scss';

const NeonLightPopup = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [currentImage, setCurrentImage] = useState('red');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => prev === 'red' ? 'green' : 'red');
        }, 300);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            clearInterval(interval);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const closeModal = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className={styles["popup-overlay"]}>
            <div className={styles["popup-container"]}>
                <button
                    onClick={closeModal}
                    className={styles["popup-close-button"]}
                >
                    <svg className={styles["close-icon"]} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div className={styles["popup-content"]}>
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
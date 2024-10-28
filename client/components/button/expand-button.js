import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

export default function ExpandableButton({
  bgColor = '#ffa08f',
  color = '#ffffff',
  value = '返回師資列表',
  size = '20px'
}) {
  return (
    <>
      <div className="expandable-button">
        <FaArrowLeft className="icon" />
        <span className="button-text">{value}</span>
      </div>

      <style jsx>
        {`
          .expandable-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: ${bgColor};
            color: ${color};
            padding: 10px;
            border-radius: 10px; 
            font-size: ${size};
            cursor: pointer;
            overflow: hidden;
            transition: width 0.3s ease, background-color 0.3s ease, transform 0.1s ease;
            width: 50px; 
            height: 50px;
            white-space: nowrap;
          }

          .icon {
            transition: margin 0.3s ease;
            color: ${color};
            font-size: 1.5em; /* 設定圖標大小 */
          }

          .button-text {
            opacity: 0;
            margin-left: 0;
            transition: opacity 0.3s ease, margin-left 0.3s ease;
            font-size: ${size};
          }

          /* Hover 狀態 */
          .expandable-button:hover {
            width: 200px; /* 展開效果 */
            background-color: #ffd7d4;
          }

          .expandable-button:hover .button-text {
            opacity: 1;
            margin-left: 8px; /* 文字與圖標的間距 */
          }

          .expandable-button:hover .icon {
            margin-right: 8px;
          }

          /* Active 狀態 */
          .expandable-button:active {
            transform: scale(0.95); /* 點擊時縮小 */
          }
        `}
      </style>
    </>
  );
}

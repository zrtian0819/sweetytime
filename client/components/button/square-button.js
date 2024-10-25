import React, { useState, useEffect } from 'react'

export default function SquareButton({
  bgColor = '#f46b63',
  color = '#ffffff',
  value = 'button',
  size = '20px'
}) {
  return (
    <>
      <div className="ZRT-button">{value}</div>

      <style jsx>
        {`
          .ZRT-button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background-color: ${bgColor};
            color: ${color};
            padding: 20px 30px;
            font-size:${size};
          }
        `}
      </style>
    </>
  )
}

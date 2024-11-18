import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardCards = () => {
  const [usersData, setUsersData] = useState({
    NumUser: 0,
    NumShop: 0,
    NumAdmin: 0,
  });
  const [blacklistData, setBlacklistData] = useState({
    NumBlacklist: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, blacklistResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/users`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminHome/blacklist`),
        ]);

        setUsersData(usersResponse.data[0]);
        setBlacklistData(blacklistResponse.data[0]);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('無法載入數據');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>載入中...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>{error}</div>;
  }

  const cardStyle = {
    minHeight: '120px', 
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '8px',
    flex: '1 1 200px',
    maxWidth: '120px',
    position: 'relative', // 添加相對定位
    overflow: 'hidden', // 防止數字溢出
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '10px',
  };

  const numberContainerStyle = {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  };

  const numberStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#EEB8B8',
    textShadow: '1px 1px 2px rgba(238, 184, 184, 0.3)',
    lineHeight: '1',
    transition: 'transform 0.3s ease',
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '-8px',
    width: 'calc(100% + 16px)',
    justifyContent: 'flex-start',
  };

  const cards = [
    { title: '會員人數', value: usersData.NumUser },
    { title: '商家數量', value: usersData.NumShop },
    { title: '黑名單用戶', value: blacklistData.NumBlacklist },
    { title: '管理員', value: usersData.NumAdmin },
  ];

  // 添加hover效果的函數
  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector('div[data-number]').style.transform = 'scale(1.1)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector('div[data-number]').style.transform = 'scale(1)';
  };

  return (
    <div style={containerStyle}>
      {cards.map((card, index) => (
        <div 
          key={index} 
          style={cardStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h5 style={titleStyle}>{card.title}</h5>
          <div style={numberContainerStyle}>
            <div style={numberStyle} data-number>
              {card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
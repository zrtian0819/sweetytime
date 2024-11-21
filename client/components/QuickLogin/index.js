import React from 'react';

const QuickLogin = ({ onFill }) => {
  const accounts = [
    { id: 1, name: '管理員', account: 'admin', password: '12345' },
    { id: 2, name: '蔡依琳', account: 'caiyilin', password: '12345' },
    { id: 3, name: '吳俊傑', account: 'wujunjie', password: '12345' },
    { id: 4, name: 'Cafe4', account: 'cafe4', password: '12345' }
  ];

  const handleQuickFill = (account) => {
    onFill({
      account: account.account,
      password: account.password
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {accounts.map((account) => (
        <button
          key={account.id}
          onClick={() => handleQuickFill(account)}
          type="button"
          style={{
            backgroundColor: '#f3f4f6',
            whiteSpace: 'nowrap',
            border: '1px solid #e5e7eb',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          {account.name}
        </button>
      ))}
    </div>
  );
};

export default QuickLogin;
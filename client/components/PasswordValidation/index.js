import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';

const PasswordValidation = ({ password, onValidationChange }) => {
  const [validations, setValidations] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false
  });

  const criteria = [
    { 
      id: 'length', 
      label: '12個字',
      validate: (pwd) => pwd.length >= 12 
    },
    { 
      id: 'letter', 
      label: '英文字母',
      validate: (pwd) => /[a-zA-Z]/.test(pwd) 
    },
    { 
      id: 'number', 
      label: '數字',
      validate: (pwd) => /\d/.test(pwd) 
    }
  ];

  useEffect(() => {
    const newValidations = criteria.reduce((acc, criterion) => ({
      ...acc,
      [criterion.id]: criterion.validate(password)
    }), {});

    setValidations(newValidations);
    const isAllValid = Object.values(newValidations).every(Boolean);
    onValidationChange?.(isAllValid);
  }, [password, onValidationChange]);

  return (
    <div className={styles['password-validation']}>
      {criteria.map(({ id, label }) => (
        <div 
          key={id}
          className={`${styles['validation-item']} ${validations[id] ? styles['valid'] : ''}`}
        >
          <span className={styles['validation-dot']}></span>
          <span className={styles['validation-text']}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordValidation;
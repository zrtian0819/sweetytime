// deleteTeacher.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const DeleteTeacher = ({ teacherId, initialValid }) => {
  // 假設 initialValid 來自於外部傳入，表示教師目前的啟用狀態
  const [isValid, setIsValid] = useState(initialValid);

  const toggleValidStatus = async () => {
    // 假設 fake API 呼叫（實際上不會發送請求）
    const newValidStatus = !isValid;
    
    try {
      // 模擬 axios 請求，但實際上不會發送
      // 可以在這裡將 `url` 換成真實 API 路徑
      const response = await axios.post('/api/teachers/toggle', {
        teacher_id: teacherId,
        valid: newValidStatus ? 1 : 0,
      });
      
      console.log('伺服器響應:', response.data); // 這行在實際操作中會顯示伺服器回應

      // 更新狀態
      setIsValid(newValidStatus);
      alert(`教師狀態已更新為: ${newValidStatus ? '啟用' : '停用'}`);
    } catch (error) {
      console.error('切換狀態失敗:', error);
      alert('切換狀態失敗，請稍後再試。');
    }
  };

  return (
    <div>
      <h3>教師 ID: {teacherId}</h3>
      <p>目前狀態: {isValid ? '啟用' : '停用'}</p>
      <Button
        variant="contained"
        color={isValid ? 'secondary' : 'primary'}
        onClick={toggleValidStatus}
      >
        {isValid ? '停用' : '啟用'}
      </Button>
    </div>
  );
};

export default DeleteTeacher;

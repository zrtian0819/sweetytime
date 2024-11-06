import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './teacher-sidebar.module.scss';

const TeacherSidebar = ({ setTeachers }) => {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [open, setOpen] = useState(true);

  const handleSearch = () => {
    console.log('Searching for:', { keyword, status, mainCategory, subCategory });
  };

  return (
    <div className={`${styles.sidebar} ${open ? styles.sidebarClosed : ''}`}>
      <h3 className={`${styles.sideBarTitle} mb-5 fw-bolder`}>搜尋你有興趣的老師專長</h3>

      <div className={styles.searchContainer}>
        <TextField
          variant="outlined"
          placeholder="關鍵字"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: '30px',
            '& .MuiOutlinedInput-root': {
              paddingRight: '8px',
              '& fieldset': {
                borderColor: 'transparent', // 移除外框的顏色
              },
              '&:hover fieldset': {
                borderColor: 'transparent', // 滑鼠懸停時取消外框顏色
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent', // 聚焦時取消外框顏色
              },
              '&:focus': {
                outline: 'none', // 移除聚焦時的黑色邊框
              }
            },
            width: '100%',
            marginBottom: '20px',
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        gap: '16px',
        marginBottom: '23px',
      }}>
        <FormControl
          variant="outlined"
          sx={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '30px',
            '& .MuiSelect-select': {
              paddingTop: '12px',
              paddingBottom: '12px',
            },
          }}
        >
          <InputLabel>中式</InputLabel>
          <Select
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value)}
            label="中式"
            sx={{
              borderRadius: '25px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
            }}
          >
            <MenuItem value="中式">中式</MenuItem>
            <MenuItem value="日式">日式</MenuItem>
            <MenuItem value="西式">西式</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '25px',
            '& .MuiSelect-select': {
              paddingTop: '12px',
              paddingBottom: '12px',
            },
          }}
        >
          <InputLabel>篩選項目</InputLabel>
          <Select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            label="篩選項目"
            sx={{
              borderRadius: '25px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
            }}
          >
            <MenuItem value="港式點心">港式點心</MenuItem>
            <MenuItem value="中式點心">中式點心</MenuItem>
            <MenuItem value="法式甜點">法式甜點</MenuItem>
          </Select>
        </FormControl>
      </div>

      <RadioGroup
        row
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          color: 'white',
          '& .MuiFormControlLabel-root': {
            flex: 1,
            marginLeft: '12px',
            marginRight: 0,
          },
          '& .MuiRadio-root': {
            color: 'white',
            '&.Mui-checked': {
              color: 'white',
            },
          },
        }}
      >
        <FormControlLabel value="open" control={<Radio />} label="開課中" />
        <FormControlLabel value="closed" control={<Radio />} label="課程截止" />
      </RadioGroup>

      <div
        className={styles.sidebarToggle}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
};

export default TeacherSidebar;

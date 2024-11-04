// pages/admin/AdminThemeProvider.js
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// 創建自訂主題
const theme = createTheme({
  palette: {
    primary: {
      main: '#fe6f67',
    },
    secondary: {
      main: '#ff69b4', 
    },
    text: {
      primary: '#545454', 
      secondary: '#545454', 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          color: '#545454',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#545454',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#ff69b4',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fe6f67', // 設置邊框顏色為粉紅色
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#959595', // 懸停時邊框顏色
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#747474', // 聚焦時邊框顏色
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#ff69b4', // 複選框顏色為粉紅色
        },
      },
    },
  },
});

// AdminThemeProvider 組件，用來包裹 admin 下的頁面
export default function AdminThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

AdminThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

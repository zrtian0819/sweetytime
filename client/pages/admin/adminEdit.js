// pages/admin/AdminThemeProvider.js
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// 使用您定義的顏色變數
const colors = {
  primaryMain: '#fe6f67',
  secondaryMain: '#333333',
  textPrimary: '#333333',
  textSecondary: '#fe6f67',
  backgroundDefault: '#fff5f4',
  infoMain: '#fe9d98',
  successMain: '#ffdad7',
  warningMain: '#ffcbc8',
  errorMain: '#fe6f67',
  checkboxColor: '#fe6f67',
  inputBorderColor: '#fe6f67',
  inputHoverBorderColor: '#959595',
  inputFocusedBorderColor: '#747474',
  buttonText: '#fff',
};

// 創建自訂主題
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryMain,
    },
    secondary: {
      main: colors.secondaryMain,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    background: {
      default: colors.backgroundDefault,
    },
    info: {
      main: colors.infoMain,
    },
    success: {
      main: colors.successMain,
    },
    warning: {
      main: colors.warningMain,
    },
    error: {
      main: colors.errorMain,
    },
  },
  typography: {
    fontFamily: "'Noto Sans TC', 'Roboto', sans-serif",
    h1: {
      fontFamily: "'Bebas Neue', sans-serif",
    },
    h2: {
      fontFamily: "'Bebas Neue', sans-serif",
    },
    h3: {
      fontFamily: "'Bebas Neue', sans-serif",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          color: colors.buttonText,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: colors.textPrimary,
          },
          '&:active': {
            backgroundColor: colors.textPrimary,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: colors.secondaryMain,
          },
          '& .MuiInputBase-multiline': {
            padding: '12px', // textarea 內部的 padding
            lineHeight: '1.5', // 增加行高讓文本更易讀
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.inputBorderColor, // 設置邊框顏色為粉紅色
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.inputHoverBorderColor, // 懸停時邊框顏色
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.inputFocusedBorderColor, // 聚焦時邊框顏色
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.checkboxColor, // 複選框顏色為粉紅色
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

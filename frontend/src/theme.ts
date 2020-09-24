import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'BCSans', 'Raleway', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'
    ].join(','),
    h5: {
      fontSize: '24px',
      fontWeight: 600,
      padding: '1.5rem 0',
      lineHeight: '37.95px',
    },
    h6: {
      fontSize: '20px',
      fontWeight: 600
    },
    subtitle1: {
      fontSize: '17px',
      fontWeight: 600
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px'
    },
  },
  palette: {
    primary: {
      main: '#003365'
    }
  }
});

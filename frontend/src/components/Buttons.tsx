import { styled } from '@material-ui/core'
import Button from '@material-ui/core/Button'

export const ButtonPrimary = styled(Button)({
  minWidth: '120px',
  backgroundColor: '#E8F3FD',
  color: '#003365',
  textTransform: 'none',
  fontSize: '16px',
  lineHeight: '22px',
  height: '40px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e7f2fb9c',
    boxShadow: 'none',
  }
});

export const ButtonSecondary = styled(Button)({
  minWidth: '120px',
  border: 'solid 2px #E8F3FD',
  borderRadius: '4px',
  backgroundColor: '#FFFFFF',
  color: '#103A72',
  textTransform: 'none',
  fontSize: '16px',
  lineHeight: '22px',
  height: '40px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e7f2fb9c',
    boxShadow: 'none',
  }
});

export const StyledButton = styled(Button)({
  minWidth: '120px',
  backgroundColor: '#002C71',
  color: '#fff',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#2e6ead',
    boxShadow: 'none',
  }
})

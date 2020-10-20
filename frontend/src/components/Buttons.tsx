import { styled, withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

export const ButtonPrimary = styled(Button)({
  minWidth: '120px',
  backgroundColor: '#003365',
  color: 'white',
  textTransform: 'none',
  fontSize: '16px',
  lineHeight: '22px',
  height: '40px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#003365d1',
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

export const BookingButton = styled(Button)({
  backgroundColor: '#E8F3FD',
  color: '#1A5A96',
  borderRadius: '4px',
  width: '95px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px'
})

export const StyledIconButton = withStyles({
  root: {
    backgroundColor: '#E8F3FD',
    borderRadius: '4px',
    height: '40px',
    width: '40px',
  }
})(IconButton)

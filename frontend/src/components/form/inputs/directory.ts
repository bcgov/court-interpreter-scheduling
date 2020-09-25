import {
  Box,
  FormLabel,
  InputBase,
  InputLabel,
  NativeSelect,
  TextField,
  withStyles,
} from '@material-ui/core'

export const StyledTextField = withStyles({
  root: {
    minWidth: '250px',
    '& input': {
      position: 'relative',
    },
    '& input + fieldset': {
      borderWidth: 2,
      borderRadius: '4px',
      borderColor: '#979797'
    },
    'label + &': {
      marginTop: '3.5rem',
    },
  },
})(TextField)

export const StyledSelectInput = withStyles({
  root: {
    maxHeight: '1.15em',
    minWidth: '250px',
    'label + &': {
      marginTop: '0.35rem',
    },
  },
  input: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: '4px',
    borderColor: '#979797',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    border: 'solid 2px #979797',
    marginTop: '1.2rem',
  },
})(InputBase)

export const StyledLabel = withStyles({
  root: {
    color: '#979797',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 'bold',
  },
})(InputLabel)

export const StyledFormLabel = withStyles({
  root: {
    color: '#979797',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 'bold',
    '&.Mui-focused': {
      color: '#979797',
    }
  },
})(FormLabel)

export const StyledNativeSelect = withStyles({
  icon: {
    top: '7px'
  },
})(NativeSelect)

export const FlexBox = withStyles({
  root: {
    display: 'flex',
    height: '100%',
    alignItems: 'flex-end',
  },
})(Box)

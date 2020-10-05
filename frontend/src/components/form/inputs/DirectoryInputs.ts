import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  InputBase,
  InputLabel,
  NativeSelect,
  TextField,
  withStyles,
  GridProps,
} from '@material-ui/core'

export const StyledFormControl = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
})(FormControl)

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
    '& .MuiInputBase-multiline fieldset': {
      borderWidth: 2,
      borderRadius: '4px',
      borderColor: '#979797'
    },
  },
})(TextField)

export const StyledSelectInput = withStyles({
  root: {
    minWidth: '250px',
  },
  input: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: '4px',
    borderColor: '#979797',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    border: 'solid 2px #979797',
  },
})(InputBase)

export const StyledLabel = withStyles({
  root: {
    color: '#979797',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 'bold',
    transform: 'none',
    position: 'relative',
    textTransform: 'capitalize',
    marginBottom: '1rem',
  },
})(InputLabel)

export const StyledFormLabel = withStyles({
  root: {
    color: '#979797',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: '1rem',
    '&.Mui-focused': {
      color: '#979797',
    }
  },
})(FormLabel)

export const StyledNativeSelect = withStyles({
  root: {
    height: '16px',
  }
})(NativeSelect)

export const FlexBox = withStyles({
  root: {
    display: 'flex',
    height: '100%',
    alignItems: 'flex-end',
  },
})(Box)

export const GridRow = withStyles({
  root: {
    marginTop: (props: Partial<GridProps> & { mt?: number }) => `${props.mt || 1}rem`,
    '& .MuiGrid-item': {
      paddingTop: 0,
      paddingBottom: 0,
    }
  },
})(Grid)

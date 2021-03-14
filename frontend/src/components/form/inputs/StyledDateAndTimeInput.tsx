import { withStyles } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import FormDatePicker from './FormDatePicker';

export const StyledDatePicker = withStyles({
  root: {
    minWidth: '100%',
    '& input': {
      position: 'relative',
    },
    '& fieldset': {
      borderWidth: 2,
      borderRadius: '4px',
      borderColor: '#979797',
    },
    '& .MuiInputBase-multiline fieldset': {
      borderWidth: 2,
      borderRadius: '4px',
      borderColor: '#979797',
    },
  },
})(DatePicker);

export const StyledFormDatePicker = withStyles({
  root: {
    minWidth: '100%',
    '& input': {
      position: 'relative',
    },
    '& fieldset': {
      borderWidth: 2,
      borderRadius: '4px',
      borderColor: '#979797',
    },
    '& .MuiInputBase-multiline fieldset': {
      borderWidth: 2,
      borderRadius: '4px',
      borderColor: '#979797',
    },
  },
})(FormDatePicker);

import React, { useState } from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputBase,
  InputLabel,
  Grid,
  NativeSelect,
  TextField,
  withStyles,
} from '@material-ui/core'
import { DateRangePicker, DateRange } from '@matharumanpreet00/react-daterange-picker';
import { StyledButton } from 'vaping-regulation-shared-components'
import { Field, Formik, FormikProps, useField } from 'formik'

const StyledTextField = withStyles({
  root: {
    'input': {
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
})(TextField);

const StyledSelectInput = withStyles({
  root: {
    maxHeight: '1.15em',
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
})(InputBase);

const StyledLabel = withStyles({
  root: {
    color: '#979797',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 'bold',
  },
})(InputLabel);

const StyledFormLabel = withStyles({
  root: {
    color: '#979797',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 'bold',
  },
})(FormLabel);

const StyledNativeSelect = withStyles({
  icon: {
    top: '7px'
  },
})(NativeSelect);

const Check = ({ value }: { value: number }) => (
  <FormControlLabel
    control={
      <Field
        name={`level-${value}`}
        type='checkbox'
        component={({ field, form, ...props }: any) => (
          <Checkbox
            {...field}
            {...props}
            name={`level-${value}`}
            color='primary'
          />
        )}
      />
    }
    label={value}
    labelPlacement='end'
  />
)

function Range() {
  const [open, setOpen] = useState(false)
  const [field, meta, helpers] = useField('dates')
  return (
    <>
      <button onClick={() => setOpen(!open)}>Range</button>
      <DateRangePicker
        open={open}
        {...field}
        {...meta}
        onChange={(range: DateRange) => {
          helpers.setValue(range)
          setOpen(!open)
        }}
      />
    </>
  )
}


function Search() {

  return (
    <Box>
      <Formik
        initialValues={{
          language: '',
          'level-1': false,
          'level-2': false,
          'level-3': false,
          'level-4': false,
          location: 'Abbotsford',
          dates: {}
        }}
        onSubmit={(values) => {
          console.dir(values)
        }}>
          {({ handleSubmit }: FormikProps<any>) => (
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <FormControl>
                  <StyledLabel htmlFor='language'>
                    Language
                  </StyledLabel>
                  <Field name='language' component={({ field, form, ...props }: any) => (<StyledTextField
                    id='language'
                    variant='outlined'
                    size='small'
                    {...field}
                    {...props}
                  />)} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl component='fieldset' style={{ marginTop: '1.75rem' }}>
                  <StyledFormLabel>
                    Level
                  </StyledFormLabel>
                  <FormGroup aria-label='level' row style={{ marginTop: '4px' }}>
                    <Check value={1} />
                    <Check value={2} />
                    <Check value={3} />
                    <Check value={4} />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl style={{ marginTop: '1.75rem' }}>
                  <StyledFormLabel htmlFor='location'>
                    Court Location
                  </StyledFormLabel>
                  <StyledNativeSelect
                    input={
                      <Field component={({ field, form, ...props }: any) => (
                        <StyledSelectInput
                          {...field}
                          {...props}
                        />
                      )} />
                    }
                    id='location'
                    name='location'
                    variant='outlined'
                  >
                    <option value='abbotsford'>Abbotsford</option>
                    <option value='vancouver'>Vancouver</option>
                    <option value='victoria'>Victoria</option>
                  </StyledNativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Range />
              </Grid>
              <Grid item xs={4}>
                <StyledButton type='submit' variant='contained' onClick={handleSubmit}>Search</StyledButton>
              </Grid>
            </Grid>
          )}
      </Formik>
    </Box>
  )
}

const Directory = () => {
  return (
    <Box px='150px'>
      <Search />
    </Box>
  )
}
export default Directory

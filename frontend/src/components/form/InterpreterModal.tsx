import React, { useEffect } from 'react'
import useAxios from 'axios-hooks'
import useError from 'hooks/useError'

import { StyledButton, ButtonSecondary } from 'components/Buttons'
import InterpreterInputs from 'components/form/inputs/Interpreter'
import { Schema, Initial } from 'components/form/schemas/interpreter.schema'

import { InterpreterCreate } from 'constants/interfaces'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'

import { Formik, FormikProps } from 'formik'

export default function InterpreterModal({ open, toggle }: { open: boolean, toggle: Function }) {

  const [{ response, loading, error }, createInterpreter] = useAxios({
    url: '/interpreter',
    method: 'POST',
  }, {
    manual: true
  })

  useError({ error, prefix: 'Failed to create interpreter.' })

  useEffect(() => {
    if (response?.status === 201) {
      toggle(false)
    }
  }, [response])

  return (
    <Dialog open={open} maxWidth='xl'>
      <Formik
        initialValues={Initial}
        validationSchema={Schema}
        onSubmit={async (values) => createInterpreter({ data: values })}
      >
        {({ handleSubmit, isSubmitting }: FormikProps<InterpreterCreate>) => (
          <>
            <DialogTitle>
              <Grid container justify='space-between'>
                <Grid item xs={11}>
                  <Typography variant='h6' color='primary'>
                    Add Interpreter
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <CloseIcon className='right pointer' onClick={() => toggle(false)} />
                </Grid>
              </Grid>
            </DialogTitle>

            <Divider variant='middle' />

            <DialogContent>
              <Box pt={1}>
                <InterpreterInputs />
              </Box>
            </DialogContent>

            <Divider variant='middle' />

            <DialogActions style={{ marginTop: '1rem', marginBottom: '1rem', paddingLeft: '24px', paddingRight: '24px' }}>
              <Grid container justify='space-between'>
                <Grid item xs={10}>
                  <ButtonSecondary
                    variant='outlined'
                    onClick={() => toggle(false)}
                  >
                    Cancel
                  </ButtonSecondary>
                </Grid>
                <Grid item xs={2}>
                  <StyledButton
                    className='right'
                    variant='contained'
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || loading}
                  >
                    Add Interpreter
                  </StyledButton>
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}

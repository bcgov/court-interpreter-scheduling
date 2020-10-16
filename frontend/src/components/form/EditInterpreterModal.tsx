import React, { useState, useEffect } from 'react'
import useAxios from 'axios-hooks'
import useError from 'hooks/useError'

import { StyledButton, ButtonSecondary } from 'components/Buttons'
import InterpreterInputs from 'components/form/inputs/Interpreter'
import { Schema, Initial } from 'components/form/schemas/interpreter.schema'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'

import { Formik, FormikProps } from 'formik'

type InterpreterModalProps = {
  interpreter: any;
  setInterpreter: Function;
  refetch: Function;
}

export default function EditInterpreterModal({ interpreter, setInterpreter, refetch }: InterpreterModalProps) {

  const [open, toggleOpen] = useState(!!interpreter)
  const [{ response, loading, error }, editInterpreter] = useAxios({
    url: '/interpreter/' + interpreter?.id,
    method: 'PATCH',
  }, {
    manual: true
  })

  useError({ error, prefix: 'Failed to update interpreter.' })

  useEffect(() => {
    toggleOpen(!!interpreter)
  }, [interpreter])

  useEffect(() => {
    if (response?.status === 200) {
      toggleOpen(false)
      refetch()
    }
  }, [response, refetch])

  return !interpreter ? null : (

    <Dialog open={open} onClose={() => setInterpreter(null)} maxWidth='xl'>
      <Formik
        initialValues={{
          ...Initial,
          ...interpreter,
        }}
        validationSchema={Schema}
        onSubmit={async (values) => {
          await editInterpreter({ url: '/interpreter/' + interpreter?.id, data: values })
          return
        }}
      >
        {({ handleSubmit, isSubmitting }: FormikProps<any>) => (
          <>
            <DialogTitle>
              <Grid container justify='space-between'>
                <Grid item xs={11}>
                  <Typography variant='h6' color='primary'>
                    Update Interpreter Details
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <CloseIcon className='right pointer' onClick={() => toggleOpen(false)} />
                </Grid>
              </Grid>
            </DialogTitle>

            <Divider variant='middle' />

            <DialogContent>
              <Box mt={2} mb={2}>
                <Typography variant='h4'>
                  {interpreter?.firstName} {interpreter?.lastName}
                </Typography>
              </Box>
              <InterpreterInputs />
            </DialogContent>

            <Divider variant='middle' />

            <DialogActions style={{ marginTop: '1rem', marginBottom: '1rem', paddingLeft: '24px', paddingRight: '24px' }}>
              <Grid container justify='space-between'>
                <Grid item xs={10}>
                  <ButtonSecondary
                    variant='outlined'
                    onClick={() => toggleOpen(false)}
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
                    Update Interpreter
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

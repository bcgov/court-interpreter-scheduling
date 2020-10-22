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
  const [confirmDelete, enableDelete] = useState(false)
  const [open, toggleOpen] = useState(!!interpreter)
  const [{ response, loading, error }, editInterpreter] = useAxios({
    url: '/interpreter/' + interpreter?.id,
    method: 'PATCH',
  }, {
    manual: true
  })

  const [{ response: deleteResponse, loading: deleteLoading, error: deleteError }, deleteInterpreter] = useAxios({
    url: '/interpreter/' + interpreter?.id,
    method: 'DELETE',
  }, {
    manual: true
  })

  useError({ error, prefix: 'Failed to update interpreter.' })
  useError({ error: deleteError, prefix: 'Failed to delete interpreter.' })

  useEffect(() => {
    toggleOpen(!!interpreter)
  }, [interpreter])

  useEffect(() => {
    if (response?.status === 200 || deleteResponse?.status === 200) {
      toggleOpen(false)
      refetch()
    }
  }, [response, deleteResponse, refetch])

  return !interpreter ? null : (

    <Dialog
      open={open}
      maxWidth='xl'
      onClose={() => {
        setInterpreter(null)
        enableDelete(false)
      }}
    >
      <Formik
        initialValues={{
          ...Initial,
          ...interpreter,
        }}
        validationSchema={Schema}
        onSubmit={async (values) => {
          const { bookings, ...interpreterDetails } = values
          await editInterpreter({ url: `/interpreter/${interpreter?.id}`, data: interpreterDetails })
          return
        }}
      >
        {({ handleSubmit, isSubmitting, isValid }: FormikProps<any>) => (
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
                <Grid item xs={4}>
                  <ButtonSecondary
                    variant='outlined'
                    onClick={() => toggleOpen(false)}
                  >
                    Cancel
                  </ButtonSecondary>
                  {
                    confirmDelete ? (
                      <Typography className='deleteSpan pointer confirm' component='span' onClick={() => deleteInterpreter()}>Confirm Delete Interpreter</Typography>
                    ) : (
                      <Typography className='deleteSpan pointer' component='span' onClick={() => enableDelete(true)}>
                        Delete
                      </Typography>
                    )
                  }
                </Grid>
                {
                  !isValid ?
                    <Grid item xs={4}>
                      <Box pt={1} style={{ textAlign: 'right' }}>
                        <span className='errorSpan'>Please check your inputs.</span>
                      </Box>
                    </Grid>
                  : null
                }
                <Grid item xs={2}>
                  <StyledButton
                    className='right'
                    variant='contained'
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || loading || deleteLoading}
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

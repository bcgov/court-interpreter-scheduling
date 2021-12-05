import React from 'react'
import { Box, Grid, withStyles, makeStyles } from '@material-ui/core'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import ListIcon from '@material-ui/icons/List'

const StyledBox = withStyles({
  root: {
    border: 'solid 1px #979797',
    borderRadius: '4px',
    padding: '8px',
    marginBottom: '8px',
    width: 'max-content',
  },
})(Box)

const useStyles = makeStyles({
  iconParent: {
    alignItems: 'baseline',
    display: 'flex',
    '&:last-child': {
      borderRadius: '0 4px 4px 0',
    }
  },
  active: {
    backgroundColor: 'aliceblue',
  }
})


export default function ViewToggle ({ view, setView }: { view: string, setView: Function }) {
  const classes = useStyles()
  return (
    <Box mt={2} mb={2}>
      <StyledBox>
        <Grid justify='space-evenly' alignItems='center' container spacing={2}>
          <Grid item>View Type</Grid>
          <Grid className={`pointer ${classes.iconParent} ${view === 'list' ? classes.active : ''}`} item>
            <ListIcon onClick={() => setView('list')} />
          </Grid>
          <Grid className={`pointer ${classes.iconParent} ${view === 'cal' ? classes.active : ''}`} item>
            <CalendarIcon onClick={() => setView('cal')} />
          </Grid>
        </Grid>
      </StyledBox>
    </Box>
  )
}

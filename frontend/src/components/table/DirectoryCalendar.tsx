import React from 'react'
import moment from 'moment'
import { Box, Grid, Typography, withStyles } from '@material-ui/core'
import { SearchContext } from 'views/Directory'
import BookingButton from 'components/table/BookingButton'

type CalendarProps = {
  interpreters: Array<any>;
  setInterpreter: Function;
}

const OutlinedGridItem = withStyles({
  root: {
    minHeight: '275px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeft: 'solid 1px #DFECFF',
    borderTop: 'solid 1px #DFECFF',
    borderBottom: 'solid 1px #DFECFF',
    '&:last-child': {
      borderRight: 'solid 1px #DFECFF',
    },
  },
})(Grid)

const FlexBox = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
})(Box)

const LinkTypography = withStyles({
  root: {
    textDecoration: 'underline',
    color: '#1A5A96',
    fontWeight: 600,
  },
})(Typography)

export default function Calendar ({ interpreters, setInterpreter }: CalendarProps) {
  const thing = `
  search.dates[0].date
search.dates[0].date
search.dates[0].date`
  return (
    <SearchContext.Consumer>
      {({ search }) => (
        <Box>
          <Grid container>
            <Grid item xs={3}>
              <Typography variant='subtitle1'>Interpreters ({interpreters.length} results)</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='subtitle1'>{moment().subtract(1, 'month').format('MMMM YYYY')}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='subtitle1'>{moment().format('MMMM YYYY')}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='subtitle1'>{moment().add(1, 'month').format('MMMM YYYY')}</Typography>
            </Grid>
          </Grid>
          {
            interpreters.map(i => (
              <Box mb={1} mt={1}>
                <Grid container>
                  <OutlinedGridItem item xs={3}>
                    <Box mb={1}>
                      <Typography variant='subtitle1'>{i.firstName} {i.lastName}</Typography>
                    </Box>
                    <Grid container>
                      <Grid item xs={6}><Typography variant='subtitle1'>Level:</Typography></Grid>
                      <Grid item xs={6}>Lv 1 - {search.language || 'Portuguese'}</Grid>
                      <Grid item xs={6}><Typography variant='subtitle1'>Distance:</Typography></Grid>
                      <Grid item xs={6}>0.5km</Grid>
                      <Grid item xs={6}><Typography variant='subtitle1'>Drive time:</Typography></Grid>
                      <Grid item xs={6}>20mins</Grid>
                    </Grid>
                    <FlexBox mt={1}>
                      <BookingButton onClick={() => setInterpreter(i)}>Book</BookingButton>
                      <Box px={1}><LinkTypography variant='body1'>More Details</LinkTypography></Box>
                    </FlexBox>
                  </OutlinedGridItem>
                  <OutlinedGridItem item xs={3}>

                  </OutlinedGridItem>
                  <OutlinedGridItem item xs={3}>

                  </OutlinedGridItem>
                  <OutlinedGridItem item xs={3}>

                  </OutlinedGridItem>
                </Grid>
              </Box>
            ))
          }
        </Box>
      )}
    </SearchContext.Consumer>
  )
}

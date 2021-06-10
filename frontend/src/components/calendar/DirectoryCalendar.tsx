import React from 'react';
import moment from 'moment';
import { Box, Grid, Typography, withStyles } from '@material-ui/core';
import SearchContext from 'contexts/SearchContext';
import Month from 'components/calendar/Month';
import MoreDetails from 'components/calendar/MoreDetails';
import BookingButton from 'components/table/BookingButton';
import { Language } from 'constants/interfaces';

type CalendarProps = {
  interpreters: Array<any>;
  setInterpreter: Function;
};

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
})(Grid);

const FlexBox = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
})(Box);

export default function Calendar({
  interpreters,
  setInterpreter,
}: CalendarProps) {
  return (
    <SearchContext.Consumer>
      {({ search }) => (
        <Box>
          <Grid container>
            <Grid item xs={3}>
              <Typography variant="subtitle1">
                Interpreters ({interpreters.length} results)
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">
                {moment().subtract(1, 'month').format('MMMM YYYY')}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">
                {moment().format('MMMM YYYY')}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">
                {moment().add(1, 'month').format('MMMM YYYY')}
              </Typography>
            </Grid>
          </Grid>
          {interpreters.map((i) => {
            const langs = search.language
              ? i?.languages.filter(
                  (l: Language) => l.languageName === search.language
                )
              : i?.languages;
            return (
              <Box mb={1} mt={1}>
                <Grid container>
                  <OutlinedGridItem item xs={3}>
                    <Box mb={1}>
                      <Typography variant="subtitle1">
                        {i.firstName} {i.lastName}
                      </Typography>
                    </Box>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">Level:</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Grid container justify="flex-start" direction="column">
                          {langs.map((l: Language) => (
                            <Grid
                              item
                              xs={12}
                            >{`Lv ${l?.level} - ${l?.languageName}`}</Grid>
                          ))}
                        </Grid>
                      </Grid>

                      {(i?.distance || i?.distance === 0) && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="subtitle1">
                              Distance:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            {`${i.distance} km`}
                          </Grid>
                        </>
                      )}
                    </Grid>
                    <FlexBox mt={1}>
                      <BookingButton
                        conflicts={i.conflicts}
                        onClick={() => setInterpreter(i)}
                      >
                        Book
                      </BookingButton>
                      <Box px={1}>
                        <MoreDetails
                          search={search}
                          interpreter={i}
                          setInterpreter={setInterpreter}
                        />
                      </Box>
                    </FlexBox>
                  </OutlinedGridItem>
                  <OutlinedGridItem item xs={3}>
                    <Month start={0} bookings={i?.bookings} />
                  </OutlinedGridItem>
                  <OutlinedGridItem item xs={3}>
                    <Month start={1} bookings={i?.bookings} />
                  </OutlinedGridItem>
                  <OutlinedGridItem item xs={3}>
                    <Month start={2} bookings={i?.bookings} />
                  </OutlinedGridItem>
                </Grid>
              </Box>
            );
          })}
        </Box>
      )}
    </SearchContext.Consumer>
  );
}

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAxiosGet } from 'hooks/axios';
import useError from 'hooks/useError';
import { useAlert } from 'hooks/useAlert';

import { Box, CircularProgress } from '@material-ui/core';

import ContentBox from 'components/layout/ContentBox';
import Search from 'components/form/InterpreterSearch';
import InterpreterSearchTable from 'components/table/InterpreterSearchTable';

import { Booking, BookingDate, SearchParams } from 'constants/interfaces';
import SearchContext from 'contexts/SearchContext';

interface LocationState {
  booking: Booking;
}

const CreateBooking = () => {
  const { state } = useLocation<LocationState>();
  const [search, setSearch] = useState<SearchParams>({
    language: '',
    level: [],
    // TODO: update with clerk location on login
    location: null,
    dates: [],
  });

  const [{ data: interpreters, loading, error }, getInterpreters] =
    useAxiosGet('/interpreter');
  useError({ error, prefix: 'Failed to load search results.' });

  const getSearchResults = async (params: SearchParams) => {
    setSearch(params);
    await getInterpreters({
      url: '/interpreter/search',
      method: 'POST',
      data: params,
    });
  };

  /**
   * copy email
   */
  const { addAlert } = useAlert();
  const copyEmails = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(
      interpreters?.data.map((intp: any) => intp.email).join('; ')
    );
    addAlert('Copied to clipboard');
  };

  useEffect(() => {
    if (state?.booking) {
      const { booking } = state;
      getSearchResults({
        language: booking.language,
        level: ['1', '2', '3', '4'],
        location: search.location,
        dates: booking.dates.map((d: BookingDate) => ({
          date: d.date,
          period: d.period,
          arrivalTime: d.arrivalTime,
        }))
      })
    }
  }, []);

  return (
    <ContentBox>
      <SearchContext.Provider
        value={{ search, updateSearchContext: setSearch }}
      >
        <Search getSearchResults={getSearchResults} />
        {loading ? (
          <Box mt={12}>
            <CircularProgress />
          </Box>
        ) : interpreters ? (
          <InterpreterSearchTable
            data={interpreters.data}
            disabled={!search.dates.length}
            handleCopyEmails={copyEmails}
          />
        ) : null}
      </SearchContext.Provider>
    </ContentBox>
  );
};
export default CreateBooking;

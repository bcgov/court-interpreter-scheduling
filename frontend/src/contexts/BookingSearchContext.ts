import { createContext } from 'react';
import { BookingSearchParams } from 'constants/interfaces';

const BookingSearchContext = createContext<{
  search: BookingSearchParams;
  updateSearchContext: Function;
}>({
  search: {
    file: '',
    interpreter: '',
    locationId: undefined,
    dates: [],
  },
  updateSearchContext: () => {},
});

export default BookingSearchContext;

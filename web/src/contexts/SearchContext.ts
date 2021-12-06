import { createContext } from 'react';
import { SearchParams } from 'constants/interfaces';

const SearchContext = createContext<{
  search: SearchParams;
  updateSearchContext: Function;
}>({
  search: {
    language: '',
    level: [],
    location: null,
    dates: [],
  },
  updateSearchContext: () => {},
});

export default SearchContext;

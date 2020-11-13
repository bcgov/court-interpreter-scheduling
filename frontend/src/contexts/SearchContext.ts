import { createContext } from 'react'
import { SearchParams } from 'constants/interfaces'

const SearchContext = createContext<{
  search: SearchParams,
  updateSearchContext: Function,
}>({
  search: {
    language: '',
    level: [],
    city: '',
    dates: []
  },
  updateSearchContext: () => {}
})

export default SearchContext

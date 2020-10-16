import { createContext } from 'react'
import { InterpreterSearchParams } from 'constants/interfaces'

const InterpreterSearchContext = createContext<{
  search: InterpreterSearchParams,
  updateSearchContext: Function,
}>({
  search: {
    language: '',
    level: [],
    city: ''
  },
  updateSearchContext: () => {}
})

export default InterpreterSearchContext

import { createContext } from 'react'
import { InterpreterSearchParams } from 'constants/interfaces'

const InterpreterSearchContext = createContext<{
  search: InterpreterSearchParams,
  updateSearchContext: Function,
}>({
  search: {
    name: '',
    language: '',
    keywords: '',
    level: [],
    city: '',
    active: ''
  },
  updateSearchContext: () => {}
})

export default InterpreterSearchContext

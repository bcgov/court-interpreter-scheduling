import { createContext } from 'react'

const ErrorContext = createContext<{
  message: string,
  updateErrorContext: Function,
}>({
  message: '',
  updateErrorContext: () => {}
})

export default ErrorContext

import { createContext } from 'react'

export const ErrorContext = createContext<{
  message: string,
  updateErrorContext: Function,
}>({
  message: '',
  updateErrorContext: () => {}
})

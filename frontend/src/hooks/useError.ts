import { useEffect, useContext } from 'react'
import { AxiosError } from 'axios'
import ErrorContext from 'contexts/ErrorContext'

export default function useError ({ error, prefix}: {
  error: AxiosError | undefined,
  prefix?: string,
}) {
  const { updateErrorContext } = useContext(ErrorContext)
  useEffect(() => {
    if (error) {
      const message = prefix ? `${prefix} ${error.message}` : `${error.message || 'An unknown error occurred'}`
      updateErrorContext(message)
    }
  }, [error])
  return
}

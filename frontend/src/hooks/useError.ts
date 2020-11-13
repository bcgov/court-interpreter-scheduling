import { useEffect, useContext } from 'react'
import { AxiosError } from 'axios'
import ErrorContext from 'contexts/ErrorContext'

export default function useError ({ error, prefix }: {
  error: AxiosError | undefined,
  prefix?: string,
}) {
  const { updateErrorContext } = useContext(ErrorContext)
  useEffect(() => {
    if (error) {
      error.message = error.message || 'An unknown error occurred.'
      if (error.response?.data?.message) {
        error.message = error.response?.data?.message
      }
      const message = prefix ? `${prefix} ${error.message}` : error.message
      updateErrorContext(message)
    }
  }, [error, prefix, updateErrorContext])
  return
}

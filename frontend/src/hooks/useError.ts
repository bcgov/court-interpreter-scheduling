import { useEffect, useContext } from 'react';
import { AxiosError } from 'axios';
import ErrorContext from 'contexts/ErrorContext';

export default function useError({
  error,
  prefix,
}: {
  error: AxiosError | undefined;
  prefix?: string;
}) {
  const { updateErrorContext } = useContext(ErrorContext);
  useEffect(() => {
    if(!error) return;
    
    let message = error?.message || 'An unknown error occurred.';
    // Decode error response
    if (error?.response && error?.response.data) {
      const data = error.response.data;
      if (data.error) {
        if (data.error.constructor === Array) {
          const errors: string[] = data.error || [];
          message = errors.join('/');
        } else {
          message = `${error}`;
        }
      } else {
        const dataMessage = data.message;
        if (dataMessage) {
          if (dataMessage.constructor === Array) {
            message = dataMessage.join('/');
          } else {
            message = dataMessage;
          }
        }
      }
    }

    const errorMessage = `${message} (${error?.response?.statusText})`;
    const finalMessage = prefix
      ? `${prefix} Error: ${errorMessage}`
      : `Unable to perform operation. Error: ${errorMessage}`;
    updateErrorContext(finalMessage);
  }, [error, prefix, updateErrorContext]);
}

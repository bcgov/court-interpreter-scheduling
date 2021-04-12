import React, { createContext, useContext, useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

type AlertProviderProps = { children: React.ReactNode };

const AlertContext = createContext<any>(null);

function RenderSnack({
  id,
  message,
  open,
  handleClose,
  autoHideDuration,
}: any) {
  const messageId = `message-${id}`;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': messageId,
      }}
      message={<span id={messageId}>{message}</span>}
      action={
        <>
          {autoHideDuration === null && (
            <CircularProgress color="secondary" size="2rem" />
          )}
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </>
      }
    />
  );
}

let uniqueId = 2;

function AlertProvider({ children }: AlertProviderProps) {
  const [{ current, queue }, setState] = useState<any>({
    current: null,
    queue: [],
  });

  function addAlert(message: any, autoHideDuration: number | null = 4000) {
    const id = uniqueId++;
    const snack = { id, message, open: true, autoHideDuration };
    setState({ queue, current: snack });
    return id;
  }

  function handleClose() {
    setState((currentState: any) => ({
      ...currentState,
      current: { ...currentState.current, open: false },
    }));
    // time to snack close animation
    setTimeout(openNext, 1000);
  }

  function openNext() {
    if (queue.length) {
      setState({ current: queue[0], queue: queue.slice(1) });
    } else {
      setState({ current: null, queue: [] });
    }
  }

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      {current && (
        <RenderSnack key={current.id} {...current} handleClose={handleClose} />
      )}
    </AlertContext.Provider>
  );
}

function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlertState must be used within a AlertProvider');
  }
  return context;
}

export { AlertProvider, useAlert };

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  withStyles,
  Theme,
  TabsActions,
} from '@material-ui/core';

interface StyledTabProps {
  label: string;
  value: string;
}

const useStyles = makeStyles({
  header: {
    position: 'fixed',
    top: '70px',
    zIndex: 11,
    alignItems: 'center',
    backgroundColor: '#38598A', // TODO: Replace with theme color once theme is refactored with MUI
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    padding: '0 65px 0 180px',
    color: '#fff',
    display: 'flex',
  }
});

const BCTabs = withStyles({
  indicator: {
    display: 'none',
  },
})(Tabs);

const BCTab = withStyles((theme: Theme) => ({
  root: {
    textTransform: 'none',
    fontSize: '18px',
    minWidth: 175,
    height: '100%',
    opacity: 1,
    '&:hover': {
      opacity: 0.7,
    },
    '&$selected': {
      color: '#FFFFFF',
      backgroundColor: '#597DAA',
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  selected: {
    borderBottom: 'solid 2px #FCBA19'
  },
}))((props: StyledTabProps) => <Tab disableRipple {...props} />);

export default function Header() {
  const history = useHistory()
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState('/bookings')

  const handleNav = (event: React.ChangeEvent<{}>, value: any) => setActiveTab(value)

  useEffect(() => {
    history.push(activeTab)
  }, [activeTab])

  return (
    <Paper elevation={0} square className={classes.header}>
      <BCTabs
        value={activeTab}
        onChange={handleNav}
      >
        <BCTab label='Bookings' value='/bookings' />
        <BCTab label='Search Interpreters' value='/directory' />
      </BCTabs>
    </Paper>
  );
}

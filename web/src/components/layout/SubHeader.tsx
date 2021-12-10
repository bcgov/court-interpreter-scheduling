import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { KeycloakInstance } from 'keycloak-js';

import { makeStyles, Tab, Tabs, withStyles, Theme } from '@material-ui/core';

import ContentBox from 'components/layout/ContentBox';
import { withFlag } from 'components/reusable/withFlag';

interface StyledTabProps {
  label: string;
  value: string;
}

const useStyles = makeStyles({
  subheader: {
    gridArea: 'subheader',
    alignItems: 'center',
    backgroundColor: '#38598A',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    color: '#fff',
    display: 'flex',
  },
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
    borderBottom: 'solid 2px #FCBA19',
  },
}))((props: StyledTabProps) => <Tab disableRipple {...props} />);

const WithFlagTab = withFlag(BCTab);

export default function Header() {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleNav = (event: React.ChangeEvent<{}>, value: any) => {
    setActiveTab(value);
    history.push(value);
  };

  useEffect(() => {
    if (activeTab !== location.pathname) {
      setActiveTab(location.pathname);
    }
  }, [location.pathname, activeTab]);

  return (
    <ContentBox className={classes.subheader}>
      <BCTabs value={activeTab} onChange={handleNav}>
        <WithFlagTab label="Bookings" value="/home/bookings" />
        <BCTab label="Search Interpreters" value="/home/create" />
        {keycloak?.hasRealmRole('cis-admin') && (
          <BCTab label="Interpreter Directory" value="/home/directory" />
        )}
      </BCTabs>
    </ContentBox>
  );
}

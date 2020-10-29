import React from 'react'
import { Link } from 'react-router-dom'

import { useKeycloak } from '@react-keycloak/web'
import { KeycloakInstance } from 'keycloak-js'

import { makeStyles, Typography } from '@material-ui/core'

import logo from '../../assets/images/logo-banner.svg'

const useStyles = makeStyles({
  header: {
    gridArea: 'header',
    alignItems: 'center',
    backgroundColor: '#036', // TODO: Replace with theme color once theme is refactored with MUI
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    borderBottom: '2px solid #fcba19',
    padding: '0 65px 0 150px',
    color: '#fff',
    display: 'flex',
  },
  titleWrapper: {
    width: '100%',
  },
  topTitle: {
    height: '26px',
    width: '350px',
    color: '#FFFFFF',
    fontSize: '18px',
    letterSpacing: 0,
    lineHeight: '26px',
  },
  logoWrapper: {
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    // borderRight: '1px solid #F3B229',
    marginRight: '24px',
  },
  logo: {
    height: '37px',
  },
  help: {
    minWidth: '195px',
  },
  getHelp: {
    color: '#F3B229',
    fontWeight: 'bold',
  },
  accountType: {
    color: 'white',
  },
  authButton: {
    color: '#181818',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    margin: '1rem 2rem',
    border: 'solid 1px white',
    borderRadius: '5px',
    fontWeight: 600,
    backgroundColor: 'whitesmoke',
    boxShadow: 'grey 1px 1px',
    '&:hover': {
      cursor: 'pointer',
    },
  }
})

export default function Header() {
  const classes = useStyles()
  const { keycloak } = useKeycloak<KeycloakInstance>()
  return (
    <div className={classes.header}>
      <Link to='/' className={classes.logoWrapper}>
        <img className={classes.logo} src={logo} alt='Go to the homepage' />
      </Link>
      <div className={classes.titleWrapper}>
        <Typography className={classes.topTitle}>
          Court Services Branch Scheduling System
        </Typography>
      </div>
      {
        keycloak?.authenticated && (
          <div>
            <Typography onClick={() => keycloak?.logout()} className='pointer'>Logout</Typography>
          </div>
        )
      }
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'

import { makeStyles, Typography, Box, CircularProgress } from '@material-ui/core'
import ContentBox from 'components/layout/ContentBox'

import logo from '../../assets/images/logo-banner.svg'

import { useAxiosGet } from 'hooks/axios';

const useStyles = makeStyles({
  header: {
    gridArea: 'header',
    alignItems: 'center',
    backgroundColor: '#036', // TODO: Replace with theme color once theme is refactored with MUI
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    borderBottom: '2px solid #fcba19',
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

export function UpdateInterpreter(){
  const [{ data, error, loading }, updateInterpreters] = useAxiosGet('/interpreter/update-geo-coordinates',{manual:true});
  return(
    <button style={{margin:"0 0rem", cursor:"text", color:"#FFF", backgroundColor:"#036", border: "0px solid black"}} onClick={()=> updateInterpreters()} >Interpreter</button>
  )
}

export function UpdateLocation(){
  const [{ data, error, loading }, updateLocations] = useAxiosGet('/update-locations',{manual:true});
  return(
    <button style={{margin:"0 0rem", cursor:"text", color:"#FFF", backgroundColor:"#036", border: "0px solid black"}} onClick={()=> updateLocations()} >Court</button>
  )
}

export default function Header() {
  const [{ data, error, loading }] = useAxiosGet('/user-info/logout-route');

  const classes = useStyles()

  if (loading) 
    return (
      <Box p={2}>
        <CircularProgress />
      </Box>
    );

  // console.log(data)

  return (
    <ContentBox className={classes.header}>
      <Link to='/' className={classes.logoWrapper}>
        <img className={classes.logo} src={logo} alt='Go to the homepage' />
      </Link>
      <div className={classes.titleWrapper}>
        <Typography className={classes.topTitle}>
          <UpdateLocation/>
          <UpdateInterpreter/> 
          Scheduling
        </Typography>
      </div>
      {
        data?.logout_url && (
          <div>
            <Typography onClick={() => window.location.replace(data.logout_url)} className='pointer'>Logout</Typography>
          </div>
        )
      }
    </ContentBox>
  )
}

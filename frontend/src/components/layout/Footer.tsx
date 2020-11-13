import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  footer: {
    backgroundColor: '#036', // TODO: Replace with theme color once theme is refactored with MUI
    width: '100%',
    maxWidth:'100vw',
    position: 'fixed',
    zIndex: 11,
    boxSizing: 'border-box',
    borderTop: '2px solid #fcba19',
    padding: '0 30px 0 30px',
    color: '#fff',
    display: 'flex',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom:' 0',
  },
  linkGroup :{
    fontSize: '12px',
    lineHeight: '17px',
  },
  link: {
    padding: '0px 15px 0px 15px',
    textDecoration: 'none',
    color: '#fff'
  }
})

export default function Footer() {
  const classes = useStyles()

  return (
    <div className={classes.footer}>
      <div className={classes.linkGroup}>
        <a className={classes.link} href='www.google.com' target='_blank'>Home</a>
        |
        <a className={classes.link} href='www.google.com' target='_blank'>About gov.bc.ca</a>
        |
        <a className={classes.link} href='www.google.com' target='_blank'>Disclaimer</a>
        |
        <a className={classes.link} href='www.google.com' target='_blank'>Accessibility</a>
        |
        <a className={classes.link} href='www.google.com' target='_blank'>Copyright</a>
        |
        <a className={classes.link} href='www.google.com' target='_blank'>Contact Us</a>
      </div>
    </div>
  )
}

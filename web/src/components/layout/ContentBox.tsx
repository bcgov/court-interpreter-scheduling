import React from 'react';
import Box from '@material-ui/core/Box';

export default function ContentBox (props: React.ComponentProps<'div'>) {
  return (
    <Box {...props} px={{ xs:'15px', sm: '75px', md: '150px' }}>
      {props.children}
    </Box>
  );
};
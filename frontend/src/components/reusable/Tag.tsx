import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

interface TagProps {
  copy?: string;
  color?: string;
  className?: string;
  data?: any;
}

const StyledBox = withStyles(() => ({
  root: {
    fontSize: '14px',
    padding: '1rem 0.5rem 0 0.5rem',
  },
}))(Box);

export default function Tag ({ copy = "New", color = "green", className, data }: TagProps) {
  return (
    <Tooltip arrow title={
      <StyledBox>
        <b>
          New Interpreter Added
        </b>
        <p>
          Interpreter added on {moment(data.createdAt).format('MMM DD, YYYY')}
        </p>
      </StyledBox>
    }>
      <span className={`tag ${color} ${className}`}>
        {copy}
      </span>
    </Tooltip>
  )
};

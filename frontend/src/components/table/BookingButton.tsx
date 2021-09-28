import React from 'react';
import { withStyles } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { StyledTooltip } from 'components/reusable/StyledTooltip';
import { Conflict } from 'constants/interfaces';

export const StyledButton = withStyles({
  root: {
    backgroundColor: '#E8F3FD',
    color: '#1A5A96',
    borderRadius: '4px',
    width: '95px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
})(Button);

type BookingButtonProps = ButtonProps & {
  conflicts?: Conflict[]
}

export default function BookingButton(props: BookingButtonProps) {
  const tooltipContent = props.conflicts?.length ? (
    <div>
        <p>Scheduling Conflict (1/{props.conflicts.length})</p>
        <p>File: {props.conflicts[0].file}</p>
        {props.conflicts[0].location ? <p>Location: {props.conflicts[0].location}</p> : null}
    </div>
  ) : "Please select dates to create a new booking"
  return props.disabled || props.conflicts?.length ? (
    <StyledTooltip title={tooltipContent}>
      <span>
        <StyledButton { ...props} disabled>Book</StyledButton>
      </span>
    </StyledTooltip>
  ) : (
    <StyledButton {...props}>Book</StyledButton>
  );
}

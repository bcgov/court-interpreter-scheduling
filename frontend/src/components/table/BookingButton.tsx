import React from 'react';
import { withStyles } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { StyledTooltip } from 'components/reusable/StyledTooltip';

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

export default function BookingButton(props: ButtonProps & { available?: boolean }) {
  return props.disabled ? (
    <StyledTooltip title="Please select dates to create a new booking">
      <span>
        <StyledButton {...props}>Book</StyledButton>
      </span>
    </StyledTooltip>
  ) : (
    <StyledButton {...props}>Book</StyledButton>
  );
}

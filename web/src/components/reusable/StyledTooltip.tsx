import React, { FC } from 'react';
import { Theme, withStyles } from '@material-ui/core';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';

const BiggerTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    fontSize: '14px',
  },
}))(Tooltip);

interface InternalProps {}
type IProps = InternalProps & TooltipProps;

export const StyledTooltip: FC<IProps> = (props) => {
  return <BiggerTooltip {...props}>{props.children}</BiggerTooltip>;
};

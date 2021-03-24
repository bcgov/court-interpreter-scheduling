import React from 'react';

import * as localStorageUtil from 'util/localStorageUtil';

export function withFlag<P>(WrappedComponent: React.ComponentType<P>) {
  const Component = (props: P) => {
    return <WrappedComponent {...props} />;
  };

  if (
    process.env.NODE_ENV !== 'development' &&
    localStorageUtil.getData<boolean>('flag')
  ) {
    return () => null;
  }
  return Component;
}

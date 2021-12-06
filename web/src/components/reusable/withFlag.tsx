import React from 'react';

import * as localStorageUtil from 'util/localStorageUtil';

export function checkIfFlag() {
  return (
    process.env.NODE_ENV !== 'development' &&
    localStorageUtil.getData<boolean>('flag')
  );
}

export function withFlag<P>(WrappedComponent: React.ComponentType<P>) {
  const Component = (props: P) => {
    return <WrappedComponent {...props} />;
  };

  if (checkIfFlag()) {
    return () => null;
  }
  return Component;
}

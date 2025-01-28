import React, { ReactElement } from 'react';
import Header from '../../components/src/Header';

const withHeader = (Component: () => ReactElement) => {
  const ComponentWithHeader = () => (
    <>
      <Header />
      <Component />
    </>
  );
  return ComponentWithHeader;
};

export default withHeader;

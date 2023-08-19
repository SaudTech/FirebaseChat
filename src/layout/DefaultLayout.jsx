import React from 'react';
import NavigationBar from '../components/NavigationBar';
import { Container } from '@mui/material';

function DefaultLayout({ children }) {
  return (
    <div>
      <NavigationBar />
      <Container>
        {children}
      </Container>
    </div>
  );
}

export default DefaultLayout;

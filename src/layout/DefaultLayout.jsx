import React from 'react';
import NavigationBar from '../components/NavigationBar';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

function DefaultLayout() {
  return (
    <div>
      <NavigationBar />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default DefaultLayout;

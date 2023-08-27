import React, { useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
function DefaultLayout() {
  const useA = useAuth();
  
  useEffect(() => {
    document.title = 'Social Media App';
  }, []);
  
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

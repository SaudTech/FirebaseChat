import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { MdExitToApp } from 'react-icons/md';  // Logout Icon from React Icons

function NavigationBar() {
  const location = useLocation();  // React Router hook to get the current location

  return (
    <AppBar position="sticky" color="charcoal">
      <Toolbar>
        <Typography variant="h6" component="div" className='text-white' sx={{ flexGrow: 1 }}>
          Real time chat
        </Typography>

        <Box sx={{ color:"#fff",display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Using Link as the component for MUI Buttons */}
          <Button color={location.pathname === '/' ? 'primary' : 'inherit'} component={Link} to="/">
            Home
          </Button>

          <Button color={location.pathname === '/find-users' ? 'primary' : 'inherit'} component={Link} to="/find-users">
            Find users
          </Button>

          <Button color={location.pathname === '/messages' ? 'primary' : 'inherit'} component={Link} to="/messages">
            Messages
          </Button>

          <Button color={location.pathname === '/profile' ? 'primary' : 'inherit'} component={Link} to="/profile">
            Profile
          </Button>
        </Box>

        <IconButton edge="end" color="inherit" sx={{ color: 'red' }}>
          <MdExitToApp />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;

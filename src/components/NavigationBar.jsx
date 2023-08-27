import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { TbLogout as LogoutIcon } from 'react-icons/tb';
import { useAuth } from "../AuthContext";
import logout from "../utils/logout"


function NavigationBar() {
  const navigate = useNavigate();
  const currentUser = useAuth();
  const location = useLocation();  // React Router hook to get the current location

  return (
    <AppBar position="static" color="white">
      <Toolbar>
        <div className='flex-1'>
        <Typography variant="h6" component="div">
          Real time chat
        </Typography>
        <Typography variant="body1" component="div">
          Welcome back, {currentUser?.displayName ?? currentUser?.email}
        </Typography>
        </div>

        <Box sx={{display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color={location.pathname === '/' ? 'primary' : 'inherit'} component={Link} to="/">
            Home
          </Button>

          <Button color={location.pathname === '/messages' ? 'primary' : 'inherit'} component={Link} to="/messages">
            Messages
          </Button>

          <Button color={location.pathname === `/profile/${currentUser?.uid}` ? 'primary' : 'inherit'} component={Link} to={`/profile/${currentUser?.uid}`}>
            Profile
          </Button>
        </Box>

        <IconButton edge="end" color="inherit" sx={{ color: 'red' }} onClick={() => logout(navigate)}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;

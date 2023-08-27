import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DefaultLayout from './layout/DefaultLayout';
import { AuthProvider } from './AuthContext';
import * as Components from "./pages"


const theme = createTheme({
  palette: {
    primary: {
      main: "#6940C7"
    },
    charcoal: {
      main: '#333333',
    },
    white: {
      main: "#ffffff"
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer closeOnClick newestOnTop limit={5} />
      <AuthProvider>
        <div className='container text-center mx-auto h-screen'>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DefaultLayout />}>
                <Route path="/" element={<Components.Home />} />
                <Route path="/profile/:uid" element={<Components.Profile />} />
                <Route path="/messages" element={<Components.Messages />} />
              </Route>
              <Route path="/signin" element={<Components.auth.Signin />} />
              <Route path="/signup" element={<Components.auth.Signup />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

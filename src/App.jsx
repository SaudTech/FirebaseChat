import { ThemeProvider, createTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DefaultLayout from './layout/DefaultLayout';

const theme = createTheme({
  palette: {
    charcoal: {
      main: '#333333',
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer closeOnClick newestOnTop limit={5} />
      <div className='container text-center mx-auto h-screen'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DefaultLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App

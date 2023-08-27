import React, { useState } from 'react';
import app from '../../config/firebaseInit';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField } from "@mui/material"
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const auth = getAuth(app);

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('Test@gmail.com');
  const [password, setPassword] = useState('123456');


  const handleSignin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        toast.success('Signed in successfully')
        const user = userCredential.user;
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/')
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage)
      });
  };

  const handleSigninWithGoogle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        toast.success('Signed in successfully')
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/')
      }).catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage)
      });
  };

  return (
    <div className="h-full w-full flex justify-center items-center">

      <div className='max-w-sm bg-lavender-blush flex justify-between flex-col text-primary p-4 h-96 w-96 mx-auto rounded-md'>
        <div>
          <h1 className='text-3xl'>Signin</h1>
          <p>
            Sign in to your account
          </p>
        </div>
        <form className='flex flex-col gap-2'>
          <TextField type="email" size='small' label='Email' className='rounded-sm p-2 py-1 caret-white  text-lavender-blush w-full focus:outline-none' value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField type="password" size='small' label='Password' className='rounded-sm p-2 py-1 caret-white  text-lavender-blush w-full focus:outline-none' value={password} onChange={(e) => setPassword(e.target.value)} />
        </form>
          <Button variant='contained' onClick={handleSignin}>Sign in</Button>
        <div>
          <p>
            Don't have an account? <Link to="/signup" className='text-blue-500'>Sign up</Link>
          </p>
        </div>
        <div className='text-center'>
          <Button variant='contained' className='flex items-center text-center gap-2 text-lavender-blush' color="primary" onClick={handleSigninWithGoogle}>
            Sign in with <FcGoogle />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Signin
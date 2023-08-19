import React, { useState } from 'react';
import app from '../../config/firebase';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField } from "@mui/material"
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom';
const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');


  const handleSignup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('user', JSON.stringify(user))
        setStatus('Account Created Successfully')
        navigate('/')
      })
      .catch((error) => {
        const errorMessage = error.message.replace("Firebase: ", '').replace(" (auth/weak-password)", '')
        setStatus(errorMessage)
      });
  };
  const handleSignupWithGoogle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log(`Token: ${token}`)
        const user = result.user;
        setStatus('Account created using Google')
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/')
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(`Error Code: ${errorCode}`)
        console.log(`Credential: ${credential}`)
        setStatus(errorMessage)
      });
  };


  return (
    <div className="h-full w-full flex justify-center items-center">

      <div className='max-w-sm bg-lavender-blush flex justify-between flex-col text-gunmetal p-4 h-96 w-96 mx-auto rounded-md'>
        <div>
          <h1 className='text-3xl'>Signup</h1>
          <p>
            Create an account 
          </p>
        </div>
        <form className='flex flex-col gap-2'>
          <TextField type="email" size='small' label='Email' className='rounded-sm p-2 py-1 caret-white  text-lavender-blush w-full focus:outline-none' value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField type="password" size='small' label='Password' className='rounded-sm p-2 py-1 caret-white  text-lavender-blush w-full focus:outline-none' value={password} onChange={(e) => setPassword(e.target.value)} />
        </form>
          <Button variant='contained' color="primary" onClick={handleSignup}>Sign up</Button>
        <div>
          <p>
            Already have an account? <Link to='/signin' className='text-blue-500'>Sign in</Link>
          </p>
        </div>
        <div className='text-center'>
        <Button variant='contained' className='flex items-center text-center gap-2 text-lavender-blush' color="primary" onClick={handleSignupWithGoogle}>
            Sign up with <FcGoogle />
          </Button>
        </div>
        {status && <h1>{status}</h1>}
      </div>
    </div>
  )
}

export default Signup
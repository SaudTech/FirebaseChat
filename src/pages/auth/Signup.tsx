import React, { useState } from 'react';
import app from '../../config/firebaseInit';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField } from "@mui/material"
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import { toast } from 'react-toastify';

const auth = getAuth(app);
const db = getFirestore(app);


const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {

        try {
          const user = userCredential.user;
          const docRef = await addDoc(collection(db, "users"), {
            username: username,
            email: email,
            userId: user.uid,
          });
          console.log("Document written with ID: ", docRef.id);
          toast.success('Account Created Successfully')
          navigate('/')
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        const errorMessage = error.message.replace("Firebase: ", '').replace(" (auth/weak-password)", '')
        toast.error(errorMessage)
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
        toast.success('Account Created Successfully')
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/')
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(errorMessage)
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
          <TextField type="text" size='small' label='Username' className='rounded-sm p-2 py-1 caret-white  text-lavender-blush w-full focus:outline-none' value={username} onChange={(e) => setUsername(e.target.value)} />
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
      </div>
    </div>
  )
}

export default Signup
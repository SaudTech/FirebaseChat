import React, { useEffect } from 'react';
import { useAuth } from "../AuthContext";


const Home = () => {
  const currentUser = useAuth();
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  return (
    <>
      <div className='mt-[300px]'>
        <h1>Vite + React</h1>
        {
          currentUser ? <h2>Welcome {currentUser.email}</h2> : <h2>Welcome</h2>
        }
      </div>
    </>
  )
}

export default Home
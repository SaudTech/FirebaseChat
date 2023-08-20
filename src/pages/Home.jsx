import React, { useEffect } from 'react';
import { useAuth } from "../AuthContext";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../config/firebaseInit"

const db = getFirestore(app);

const querySnapshot = await getDocs(collection(db, "users"));
const Home = () => {
  const currentUser = useAuth();
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `, doc.data());
  });
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  return (
    <>
      <div className='mt-[300px]'>
        <h1>Vite + React</h1>
      </div>
    </>
  )
}

export default Home
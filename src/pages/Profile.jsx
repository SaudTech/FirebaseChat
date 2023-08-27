import { Button } from '@mui/material'
import React from 'react'

const Profile = () => {
  return (
    <div>
      <div>
        <h1 className='text-2xl font-bold'>Profile</h1>
      </div>

      <div className='overflow-x-auto flex'>
        {
          ['Profile', 'Setting'].map((item, index) => (
            <div key={index}>
              <Button variant='contained' color='primary'>{item}</Button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Profile  
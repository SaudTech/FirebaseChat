import { Box, Button, Divider } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import Components from "./Components"


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}> {children} </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const Profile = () => {

  const [selectedItem, setSelectedItem] = useState(0);
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Setting</h1>
      </div>

      <div className='overflow-x-auto flex'>
        {
          ['Profile', 'Setting'].map((item, index) => (
            <div key={index} className="p-2">
              <div onClick={() => setSelectedItem(index)} {...a11yProps(index)} className={`hover:bg-slate-200 p-2 rounded-md transition-all cursor-pointer h-full min-w-[80px] ${index == selectedItem ? "bg-slate-200" : ""}`}>
                {item}
              </div>
              <Divider orientation="vertical" flexItem />
            </div>
          ))
        }
      </div>

      <CustomTabPanel value={selectedItem} index={0}>
        <Components.Profile />
      </CustomTabPanel>
      <CustomTabPanel value={selectedItem} index={1}>
        <Components.Setting />
      </CustomTabPanel>

    </div>
  )
}

export default Profile  
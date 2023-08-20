import { Box, Grid, Tab, Tabs } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react'
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useAuth } from "../AuthContext";

import app from "../config/firebaseInit"

const db = getFirestore(app);


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

const Messages = () => {
  const currentUser = useAuth();
  const [tab, setTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const [messages, setMessages] = React.useState([]);
  const [newFriends, setNewFriends] = React.useState([]);

  useEffect(() => {
    fetchRooms();
  }, [])

  const fetchRooms = async () => {
    const uid = currentUser?.uid;
    const query = collection(db, "rooms").where("participants", "array-contains", uid);
    query.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      } else {
        console.log("No rooms found!");
      }
    }).catch((error) => {
      console.error("Error querying rooms:", error);
    });


    setMessages(querySnapshot.docs.map((doc) => doc.data()));
  };

  return (
    <div className='text-start'>
      <Typography variant='h4' className='my-4'>Messages</Typography>
      <Grid container>
        <Grid item xs={12} md={4} sx={{ bgcolor: '#1A1F28', borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: "background.paper" }}>
            <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Messages" className='text-white' {...a11yProps(0)} />
              <Tab label="Find friends" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={tab} index={0}>
            <List sx={{ width: '100%', color: "white" }}>
              <ListItem alignItems="flex-start" className="hover:bg-black/30 transition-all rounded-md">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  sx={{ color: "white" }}
                  primary="Ali Connors"
                  secondary={
                    <span className='text-white'>
                      I'll be in your neighborhood doing errands this…
                    </span>
                  }
                />
              </ListItem>
            </List>
          </CustomTabPanel>
          <CustomTabPanel value={tab} index={1}>
            <List sx={{ width: '100%', color: "white" }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  sx={{ color: "white" }}
                  primary="Ali Connors"
                  secondary={
                    <span className='text-white'>
                      I'll be in your neighborhood doing errands this…
                    </span>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          </CustomTabPanel>
        </Grid>
        <Grid item xs={12} md={8} className='bg-photo-blue'>
        </Grid>
      </Grid>
    </div>
  )
}

export default Messages
import { Box, Button, Grid, ListItemButton, ListItemSecondaryAction, Tab, Tabs, Tooltip } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react'
import { getDocs, collection, query, where, getFirestore, getDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import ChatRoom from "../components/ChatRoom";
import dayjs from 'dayjs'
import { BiConversation } from 'react-icons/bi'

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
  const [rooms, setRooms] = React.useState([]);
  const [newFriends, setNewFriends] = React.useState([]);
  const [room, setRoom] = React.useState(null);


  async function get_rooms_and_partcipants_info(uid) {
    const roomsQuery = query(collection(db, "rooms"), where("participants", "array-contains", uid));
    const querySnapshot = await getDocs(roomsQuery);
    let rooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(rooms)

    // Process each room to include the other participant's info
    const augmentedRoomsPromises = rooms.map(async room => {
      const otherParticipantId = room.participants.find(participantId => participantId !== uid);
      console.log(otherParticipantId)
      const usersCollection = collection(db, "users");
      const userQuery = query(usersCollection, where("userId", "==", otherParticipantId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userInfo = userSnapshot.docs[0].data();
        return {
          ...room,
          otherParticipant: {
            id: otherParticipantId,
            displayName: userInfo.displayName || userInfo.email,
            profilePicture: userInfo.profilePicture
          }
        };
      } else {
        return {
          ...room,
          otherParticipant: {
            id: otherParticipantId,
            displayName: "Unknown",
            profilePicture: ""
          }
        };
      }
    });

    const augmentedRooms = await Promise.all(augmentedRoomsPromises);
    console.log(augmentedRooms);
    setRooms(augmentedRooms);
  }
  async function find_new_friends() {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("userId", "!=", currentUser.uid));
    const userSnapshot = await getDocs(userQuery);
    let users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Remove users who are already friends. (i.e. already in rooms)
    const newFriendsLocal = users.filter(user => !rooms.some(room => room.participants.includes(user.id)));
    setNewFriends(newFriendsLocal);
    console.log(newFriendsLocal)
  }
  const updateRoom = updatedRoom => {
    let newRoom = rooms.find(room => room.id === updatedRoom.id);
    newRoom = updatedRoom;
    let allRooms = rooms.filter(room => room.id !== updatedRoom.id);
    allRooms.push(newRoom);
    setRooms(allRooms);
  };

  const start_a_new_room = async (friend) => {
    let new_room = {
      participants: [currentUser.uid, friend.id],
      status: 'new_room',
      latestMessage: null,
    };
    setTab(0);
    setRoom(new_room);
    setRooms([...rooms, new_room]);
  };



  useEffect(() => {
    if (currentUser) {
      get_rooms_and_partcipants_info(currentUser?.uid);
      find_new_friends();
    };
  }, [currentUser])
  return (
    <div className='text-start'>
      <Typography variant='h4' className='my-4'>Messages</Typography>
      <Grid container className='glassMor'>
        <Grid item xs={12} md={4} sx={{  borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: "background.paper" }}>
            <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Messages" className='text-white' {...a11yProps(0)} />
              <Tab label="Find friends" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={tab} index={0}>
            <List sx={{ width: '100%', color: "white" }}>
              {rooms.map((room) => <DisplayRoom room={room} selectRoom={() => setRoom(room)} key={room.id} />)}
            </List>
            {
              rooms.length === 0 && <div className='flex items-center justify-center h-full text-white text-2xl'>No messages</div>
            }
          </CustomTabPanel>
          <CustomTabPanel value={tab} index={1}>
            <List sx={{ width: '100%', color: "white" }}>
              <List sx={{ width: '100%', color: "white" }}>
                {newFriends.map((friend) => <NewFriend friend={friend} startARoom={start_a_new_room} key={friend.id} />)}
              </List>
              {
                newFriends.length === 0 && <div className='flex items-center justify-center h-full text-white text-2xl'>No users to show</div>
              }
            </List>
          </CustomTabPanel>
        </Grid>
        <Grid item xs={12} md={8}>
          {
            room && <ChatRoom roomId={room?.id} room={room} updateRoom={updateRoom} />
          }
          {
            !room && <div className='flex items-center justify-center h-full text-white text-2xl'>Select a room</div>
          }
        </Grid>
      </Grid>
    </div>
  )
};

const DisplayRoom = ({ room, selectRoom }) => {

  const getRelativeTime = (timestamp) => {
    const now = dayjs();
    const time = dayjs(timestamp);

    const diffSeconds = now.diff(time, 'second');
    const diffMinutes = now.diff(time, 'minute');
    const diffHours = now.diff(time, 'hour');
    const diffDays = now.diff(time, 'day');

    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffMinutes === 1) {
      return "1 minute ago";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours === 1) {
      return "1 hour ago";
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "1 day ago";
    } else {
      return `${diffDays} days ago`;
    }
  }

  return (
    <ListItem alignItems="flex-start" className="hover:bg-black/30 transition-all rounded-md cursor-pointer" onClick={selectRoom}>
      <ListItemAvatar>
        <Avatar alt={room.latestMessage?.senderUsername} />
      </ListItemAvatar>
      <ListItemText
        sx={{ color: "white" }}
        primary={room?.otherParticipant?.displayName}
        secondary={
          <span className='text-white opacity-75'>
            {room?.latestMessage?.message}
            <div className='text-xs flex justify-between items-centers'>
              <span>{room?.status}</span>
              <span>{getRelativeTime(room?.latestMessage?.timestamp)}</span>
            </div>
          </span>
        }
      />
    </ListItem>
  )
};

const NewFriend = ({ friend, startARoom }) => {
  return (
    <div className="flex justify-between items-center gap-2">
      <Tooltip title="View profile" arrow>
        <ListItem alignItems="flex-start" className="hover:bg-black/30 flex justify-between transition-all rounded-md cursor-pointer">
          <ListItemAvatar>
            <Avatar alt={friend?.username} />
          </ListItemAvatar>
          <ListItemText
            sx={{ color: "white" }}
            primary={friend?.username}
            secondary={
              <span className='text-white opacity-75'>
                Some random description here
              </span>
            }
          />
        </ListItem>
      </Tooltip>
      <Tooltip title="Start a conversation" arrow>
        <Button variant='contained' color='primary' className='ml-2' onClick={startARoom}>
          <BiConversation />
        </Button>
      </Tooltip>
    </div>
  )
}

export default Messages
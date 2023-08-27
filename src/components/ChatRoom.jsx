import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import { useAuth } from "../AuthContext";
import { getFirestore, collection, query, orderBy, where, onSnapshot, addDoc, doc, setDoc } from 'firebase/firestore';
import app from "../config/firebaseInit"
import { Button, TextField } from '@mui/material';

const db = getFirestore(app);





const ChatRoom = ({ roomId, room, updateRoom }) => {
  const currentUser = useAuth();
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');
  const receiverId = room.participants.filter(id => id !== currentUser.uid)[0];

  const sendMessage = async () => {
    try {
      let reg_ex_for_empty = /^\s*$/;
      if (reg_ex_for_empty.test(newMessage)) return;
      if (!newMessage) return;

      setNewMessage('');

      if (room.status === 'new_room') {
        // Create a brand new room
        const newly_created_room = await addDoc(collection(db, "rooms"), {
          participants: [currentUser.uid, receiverId],
          status: 'new_room',
        });
        roomId = newly_created_room.id;
      };


      let obj = {
        content: newMessage.trim(),
        receiverId,
        senderId: currentUser.uid,
        roomId,
        timestamp: new Date().getTime(),
        status: 'sent',
      };
      const docRef = await addDoc(collection(db, "messages"), obj);
      const roomRef = doc(db, "rooms", roomId);
      let timestamp = new Date().getTime();
      let latestMessage = {
        message: newMessage.trim(),
        senderUsername: currentUser.displayName || currentUser.email,
        timestamp,
      };
      await setDoc(roomRef, {
        latestMessage,
        status: 'delivered',
      }, { merge: true });

      updateRoom({
        ...room,
        latestMessage,
        status: 'delivered',
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const get_messages = () => {
    const messagesRef = collection(db, "messages");
    const roomMessagesQuery = query(messagesRef, where("roomId", "==", roomId), orderBy("timestamp"));
    const unsubscribe = onSnapshot(roomMessagesQuery, (snapshot) => {
      const allMessages = [];
      snapshot.forEach(doc => {
        allMessages.push(doc.data());
      });

      setMessages(allMessages);
    });

    return unsubscribe;
  };
  useEffect(() => {
    if (!currentUser) return;
    let unsubscribe;
    if (room?.status !== 'new_room') {
      unsubscribe = get_messages();
      mark_room_as_seen()
    }

    return unsubscribe;
  }, [currentUser]);

  const mark_room_as_seen = () => {
    try {
      if (room.status === 'new_room') return;
      const roomRef = doc(db, "rooms", roomId);
      setDoc(roomRef, {
        status: 'seen',
      }, { merge: true });

      let room_updd = {
        ...room,
        status: 'seen',
      };
      updateRoom(room_updd);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='pt-3'>
      <div>
        <div className='max-h-[500px] px-2 overflow-y-auto'>
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`min-h-[30px] rounded-md p-2 max-w-[300px] ${message.senderId === currentUser.uid ? 'bg-blue-400' : 'bg-gray'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center'>


          <TextField value={newMessage} onChange={e => setNewMessage(e.target.value)} variant='outlined' placeholder='Type a message...' fullWidth size='small' color='primary' className='bg-white'
            onKeyDown={e => {
              if (e.key === 'Enter') sendMessage();
            }} />

          <Button onClick={sendMessage} variant='contained' color='primary' className='ml-2'>Send</Button>
        </div>

      </div>
    </div>
  )
};

ChatRoom.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default ChatRoom
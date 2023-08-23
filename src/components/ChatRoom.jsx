import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import { useAuth } from "../AuthContext";
import { getFirestore, collection, query, orderBy, where, onSnapshot, addDoc,doc, setDoc } from 'firebase/firestore';
import app from "../config/firebaseInit"
import { TextField } from '@mui/material';

const db = getFirestore(app);





const ChatRoom = ({ roomId, room }) => {
  const currentUser = useAuth();
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');
  const receiverId = room.participants.filter(id => id !== currentUser.uid)[0];

  const sendMessage = async () => {
    try {

      console.log('Sending message: ', newMessage);
      setNewMessage('');

      let obj = {
        content: newMessage,
        receiverId,
        senderId: currentUser.uid,
        roomId,
        timestamp: new Date().getTime(),
        status: 'sent',
      };
      const docRef = await addDoc(collection(db, "messages"), obj);
      const roomRef = doc(db, "rooms", roomId);
      await setDoc(roomRef, {
        latestMessage: {
          message: newMessage,
          senderUsername: currentUser.displayName || currentUser.email,
          timestamp: new Date().getTime(),
        },
      }, { merge: true });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  };

  useEffect(() => {
    if (!currentUser) return;
    console.log('Fetching messages for room: ', roomId)
    const messagesRef = collection(db, "messages");
    const roomMessagesQuery = query(messagesRef, where("roomId", "==", roomId), orderBy("timestamp"));
    const unsubscribe = onSnapshot(roomMessagesQuery, (snapshot) => {
      const allMessages = [];
      console.log("Snapshot: ", snapshot);
      snapshot.forEach(doc => {
        allMessages.push(doc.data());
        console.log("Message: ", doc.data());
      });

      setMessages(allMessages);
    });


    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    console.log(messages)
  }, [messages]);

  return (
    <div>
      ChatRoom {roomId}

      <div>
        {messages.map(message => (
          <div key={message.id} className={message.senderId === currentUser.uid ? 'text-right' : 'text-left'}>
            {message.content}
          </div>
        ))}

        <TextField value={newMessage} onChange={e => setNewMessage(e.target.value)} variant='outlined' placeholder='Type a message...' fullWidth size='small' color='primary' className='bg-white'
          onKeyDown={e => {
            if (e.key === 'Enter') sendMessage();
          }} />

      </div>
    </div>
  )
};

ChatRoom.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default ChatRoom
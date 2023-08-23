import React from 'react'
import PropTypes from 'prop-types'
const ChatRoom = ({roomId}) => {
  return (
    <div>ChatRoom {roomId}</div>
  )
};

ChatRoom.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default ChatRoom
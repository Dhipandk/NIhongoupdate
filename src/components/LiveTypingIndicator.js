import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./Firebase";

const LiveTypingIndicator = ({ currentRoom }) => {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("roomId", "==", currentRoom.id), where("typing", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const typingUsers = snapshot.docs.map(doc => doc.data());
      setTypingUsers(typingUsers);
    });

    return () => unsubscribe();
  }, [currentRoom]);

  if (typingUsers.length === 0) return null;

  return (
    <div className="chat-bubble">
      {typingUsers.map(user => (
        <div key={user.uid} className="typing-user">
          <img src={user.photoURL} alt={`${user.displayName}'s avatar`} className="chat-bubble__left" />
          <div className="chat-bubble__right">
            <span>{user.displayName} is typing...</span>
            <p>{user.currentMessage}</p>
            <p>{user.translatedMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveTypingIndicator;

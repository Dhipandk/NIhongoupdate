

// // SendMessage.js
// import React, { useState } from "react";
// import { auth, db } from "./Firebase";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import axios from 'axios';

// const SendMessage = ({ scroll, currentRoom, preferences }) => {
//   const [message, setMessage] = useState("");

//   const sendMessage = async (event) => {
//     event.preventDefault();

//     if (message.trim() === "") {
//       alert("Enter valid message");
//       return;
//     }

//     const { uid, displayName, photoURL } = auth.currentUser;

//     const response = await axios.post("https://exotic-celestyn-citchennai-3903b27e.koyeb.app/send-message", {
//       message: message,
//       displayName: displayName,
//       uid: uid,
//     });

//     console.log("Response from Flask:", response.data);

//     try {
//       await addDoc(collection(db, "messages"), {
//         text: message,
//         name: displayName,
//         avatar: photoURL,
//         createdAt: serverTimestamp(),
//         uid,
//         roomId: currentRoom.id,
//         translatedtext: response.data.message,
//       });

//       setMessage("");
//       scroll.current.scrollIntoView({ behavior: "smooth" });
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <form onSubmit={sendMessage} className="send-message">
//       <label htmlFor="messageInput" hidden>
//         Enter Message
//       </label>
//       <input
//         id="messageInput"
//         name="messageInput"
//         type="text"
//         className="form-input__input"
//         placeholder="type message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button type="submit">Send</button>
//     </form>
//   );
// };

// export default SendMessage;

// import React, { useState } from "react";
// import { auth, db } from "./Firebase";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import axios from "axios";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

// const SendMessage = ({ scroll, currentRoom, preferences }) => {
//   const [message, setMessage] = useState("");
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   const handleSendMessage = async (text) => {
//     if (text.trim() === "") {
//       alert("Enter valid message");
//       return;
//     }

//     const { uid, displayName, photoURL } = auth.currentUser;

//     const response = await axios.post("https://exotic-celestyn-citchennai-3903b27e.koyeb.app/send-message", {
//       message: text,
//       displayName: displayName,
//       uid: uid,
//     });

//     console.log("Response from Flask:", response.data);

//     try {
//       await addDoc(collection(db, "messages"), {
//         text: text,
//         name: displayName,
//         avatar: photoURL,
//         createdAt: serverTimestamp(),
//         uid,
//         roomId: currentRoom.id,
//         translatedtext: response.data.message,
//       });

//       setMessage("");
//       scroll.current.scrollIntoView({ behavior: "smooth" });
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const sendMessage = async (event) => {
//     event.preventDefault();
//     await handleSendMessage(message);
//   };

//   const handleMicClick = async() => {
//     const preferredLanguage = preferences.preferredLanguage; // Default to English if no preference

//     try {
//       if (listening) {
//         SpeechRecognition.stopListening();
//         await handleSendMessage(transcript);
        
//         resetTranscript();
//       } else {
//         await navigator.mediaDevices.getUserMedia({ audio: true });
        
//         SpeechRecognition.startListening({ continuous: true, language: preferredLanguage });
//       }
//     } catch (error) {
//       console.error("Error with speech recognition:", error);
//     }

//   };

//   return (
//     <form onSubmit={sendMessage} className="send-message">
//       <label htmlFor="messageInput" hidden>
//         Enter Message
//       </label>
//       <input
//         id="messageInput"
//         name="messageInput"
//         type="text"
//         className="form-input__input"
//         placeholder="type message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button className="send" type="submit">Send</button>
//       <button className="mic" type="button" onClick={handleMicClick}>
//       <FontAwesomeIcon icon={listening ? faMicrophone :faMicrophoneSlash } />
//     </button>
//     </form>
//   );
// };

// export default SendMessage;


import React, { useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

const SendMessage = ({ scroll, currentRoom, preferences }) => {
  const [message, setMessage] = useState("");
  const [translatedMessage, setTranslatedMessage] = useState("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isTranslating,setIsTranslating] = useState("");
  const { uid, displayName, photoURL } = auth.currentUser;

  const updateTypingStatus = async (isTyping, currentMessage = "", currentTranslation = "") => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        typing: isTyping,
        currentMessage: currentMessage,
        translatedMessage: currentTranslation,
        roomId: currentRoom.id,
        uid:uid,
        displayName:displayName,
        photoURL:photoURL,
      });
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (message.trim() === "") {
        setTranslatedMessage("");
        await updateTypingStatus(false);
        return;
      }

      const translatedText = await detectLanguageAndTranslate(message);
      setTranslatedMessage(translatedText);
      await updateTypingStatus(true, message, translatedText);
    }, 300); // Debounce time set to 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [message]);

  const detectLanguageAndTranslate = async (text) => {
    try {
      const isAscii = text.charCodeAt(0) <= 127;
      let fromLang = isAscii ? "en" : "ja";
      let toLang = isAscii ? "ja" : "en";

      const translatedText = await translateText(text, fromLang, toLang);
      return translatedText;
    } catch (error) {
      console.error("Error detecting language and translating:", error);
      return "Translation Error";
    }
  };

  const translateText = async (text, from, to) => {
    if (!text.trim()) return "";

    try {
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error("Error translating:", error);
      return "Translation Error";
    }
  };

  const handleSendMessage = async (text) => {
    if (text.trim() === "") {
      alert("Enter valid message");
      return;
    }

    

    try {
      const translatedText = await detectLanguageAndTranslate(text);
      setTranslatedMessage(translatedText);

      await addDoc(collection(db, "messages"), {
        text: text,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        roomId: currentRoom.id,
        translatedtext: translatedText,
      });

      setMessage("");
      await updateTypingStatus(false);
      scroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    await handleSendMessage(message);
  };

  const handleMicClick = async () => {
    const preferredLanguage = preferences.preferredLanguage || "en"; // Default to English if no preference

    try {
      if (listening) {
        SpeechRecognition.stopListening();
        await handleSendMessage(transcript);
        resetTranscript();
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        SpeechRecognition.startListening({ continuous: true, language: preferredLanguage });
      }
    } catch (error) {
      console.error("Error with speech recognition:", error);
    }
  };

  const handleInputClick = () => {
    setIsTranslating(true); // Always show translation controls on input click
  };

  return (
    <div>
      {!browserSupportsSpeechRecognition && <span>Browser doesn't support speech recognition.</span>}
      <form onSubmit={sendMessage} className="send-message">
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          className="form-input__input"
          placeholder="Type message..."
          value={message}
          onClick={handleInputClick}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => updateTypingStatus(false)}
        />
        {/* {isTranslating && (
          <div className="translation-controls">
            <textarea className="textarea" readOnly value={translatedMessage} placeholder="Translation will appear here..." />
          </div>
        )} */}
        <button type="submit"className="send">Send</button>
        <button type="button" onClick={handleMicClick}>
          <FontAwesomeIcon icon={listening ? faMicrophoneSlash : faMicrophone} className="mic-icon" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;




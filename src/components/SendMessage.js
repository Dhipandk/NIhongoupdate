

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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import countries from "./data"; // Adjust the import path as necessary

const SendMessage = ({ scroll, currentRoom, preferences }) => {
  const [message, setMessage] = useState("");
  const [translatedMessage, setTranslatedMessage] = useState("");
  const [fromLang, setFromLang] = useState("en"); // Default language detection as English
  const [toLang, setToLang] = useState("ja"); // Default translation to Japanese
  const [isTranslating, setIsTranslating] = useState(false);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Function to perform translation
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

  // Function to detect language and translate
  const detectLanguageAndTranslate = async (text) => {
    try {
      // Detect if the character is ASCII
      const isAscii = text.charCodeAt(0) <= 127;
      let fromLang, toLang;
      
      if (isAscii) {
        fromLang = "en";
        toLang = "ja";
      } else {
        fromLang = "ja";
        toLang = "en";
      }

      const translatedText = await translateText(text, fromLang, toLang);
      setTranslatedMessage(translatedText);
      setFromLang(fromLang);
      setToLang(toLang);
    } catch (error) {
      console.error("Error detecting language and translating:", error);
      setTranslatedMessage("Translation Error");
    }
  };

  // Function to handle sending the message
  const handleSendMessage = async (text) => {
    if (text.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const { uid, displayName, photoURL } = auth.currentUser;

    try {
      await detectLanguageAndTranslate(text);

      await addDoc(collection(db, "messages"), {
        text: text,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        roomId: currentRoom.id,
        translatedtext: translatedMessage,
      });

      setMessage("");
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (message.trim() === "") {
        setTranslatedMessage("");
        return;
      }

      await detectLanguageAndTranslate(message);
    }, 300); // Debounce time set to 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [message]);

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
        />
        {isTranslating && (
        <div className="translation-controls">
         
          <textarea className="textarea"readOnly value={translatedMessage} placeholder="Translation will appear here..." />
        </div>
      )}
        <button type="submit">Send</button>
        <button>
        <FontAwesomeIcon
          icon={listening ? faMicrophoneSlash : faMicrophone}
          className="mic-icon"
          onClick={handleMicClick}
        /></button>
      </form>
     
    </div>
  );
};

export default SendMessage;





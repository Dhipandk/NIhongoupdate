
// import React, { useState, useEffect } from "react";
// import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
// import { auth, db } from "./Firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
// import { collection, getDocs, query, addDoc, serverTimestamp } from "firebase/firestore";

// const NavBar = ({ currentRoom, setCurrentRoom }) => {
//   const [user] = useAuthState(auth);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [createRoomVisible, setCreateRoomVisible] = useState(false);
//   const [joinRoomVisible, setJoinRoomVisible] = useState(false);
//   const [roomName, setRoomName] = useState("");
//   const [passKey, setPassKey] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [joinPassKey, setJoinPassKey] = useState("");
//   const [rooms, setRooms] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchRooms = async () => {
//       const q = query(collection(db, "new rooms"));
//       const querySnapshot = await getDocs(q);
//       const roomsData = [];
//       querySnapshot.forEach((doc) => {
//         roomsData.push({ id: doc.id, ...doc.data() });
//       });
//       setRooms(roomsData);
//     };

//     fetchRooms();
//   }, []);

//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//   };

//   const toggleCreateRoom = () => {
//     setCreateRoomVisible(!createRoomVisible);
//     setMenuVisible(false);
//   };

//   const toggleJoinRoom = () => {
//     setJoinRoomVisible(!joinRoomVisible);
//     setMenuVisible(false);
//   };

//   const googleSignIn = () => {
//     const provider = new GoogleAuthProvider();
//     signInWithRedirect(auth, provider);
//   };

//   const signOut = () => {
//     auth.signOut();
//     setCurrentRoom(null); // Clear the current room on sign out
//   };

//   const createRoom = async () => {
//     if (roomName.trim() && passKey.trim()) {
//       const roomRef = await addDoc(collection(db, "new rooms"), {
//         name: roomName,
//         passKey: passKey,
//         createdAt: serverTimestamp(),
//         createdBy: user.displayName,
//       });
//       setCurrentRoom({ id: roomRef.id, name: roomName });
//       setCreateRoomVisible(false);
//       setRoomName("");
//       setPassKey("");
//     } else {
//       alert("Please enter both room name and pass key.");
//     }
//   };

//   const joinRoom = () => {
//     if (joinPassKey === selectedRoom.passKey) {
//       setCurrentRoom(selectedRoom);
//       setJoinRoomVisible(false);
//       setSelectedRoom(null);
//       setJoinPassKey("");
//     } else {
//       alert("Invalid pass key. Please try again.");
//     }
//   };

//   const filteredRooms = rooms.filter((room) =>
//     room.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <nav className="nav-bar">
//       <h1>{currentRoom ? `Room: ${currentRoom.name}` : "NihonGo"}</h1>
//       {user ? (
//         <>
//           <button onClick={toggleMenu} className="menu-toggle" type="button">
//             Menu
//           </button>
//           {menuVisible && (
//             <ul className="menu">
//               <li>
//                 <button onClick={toggleCreateRoom}>Create Room</button>
//               </li>
//               <li>
//                 <button onClick={toggleJoinRoom}>Join Room</button>
//               </li>
//               <li>
//                 <button onClick={signOut} type="button">
//                   Sign Out
//                 </button>
//               </li>
//             </ul>
//           )}
//         </>
//       ) : (
//         <button className="sign-in">
//           <img
//             onClick={googleSignIn}
//             src={GoogleSignin}
//             alt="sign in with google"
//             type="button"
//           />
//         </button>
//       )}

//       {createRoomVisible && (
//         <div className="modal-overlay">
//           <div className="create-room">
//             <h2>Create Room</h2>
//             <input
//               type="text"
//               placeholder="Enter room name"
//               value={roomName}
//               onChange={(e) => setRoomName(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Enter pass key"
//               value={passKey}
//               onChange={(e) => setPassKey(e.target.value)}
//             />
//             <button onClick={createRoom}>Create</button>
//             <button onClick={() => setCreateRoomVisible(false)}>Cancel</button>
//           </div>
//         </div>
//       )}

//       {joinRoomVisible && (
//         <div className="modal-overlay">
//           <div className="join-room">
//             <h2>Join Room</h2>
//             {selectedRoom ? (
//               <>
//                 <p>Enter pass key for room: {selectedRoom.name}</p>
//                 <input
//                   type="password"
//                   placeholder="Enter pass key"
//                   value={joinPassKey}
//                   onChange={(e) => setJoinPassKey(e.target.value)}
//                 />
//                 <button onClick={joinRoom}>Join</button>
//                 <button onClick={() => setSelectedRoom(null)}>Cancel</button>
//               </>
//             ) : (
//               <>
//                 <input
//                   type="text"
//                   placeholder="Search rooms"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <ul>
//                   {filteredRooms.map((room) => (
//                     <li key={room.id}>
//                       <button onClick={() => setSelectedRoom(room)}>
//                         {room.name} - Created by {room.createdBy} on{" "}
//                         {room.createdAt.toDate().toLocaleString()}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button onClick={() => setJoinRoomVisible(false)}>Cancel</button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default NavBar;
// import React, { useState, useEffect } from "react";
// import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
// import { auth, db } from "./Firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
// import { collection, getDocs, query, addDoc, serverTimestamp, orderBy } from "firebase/firestore";

// const NavBar = ({ currentRoom, setCurrentRoom, language, toggleLanguage }) => {
//   const [user] = useAuthState(auth);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [createRoomVisible, setCreateRoomVisible] = useState(false);
//   const [joinRoomVisible, setJoinRoomVisible] = useState(false);
//   const [roomName, setRoomName] = useState("");
//   const [passKey, setPassKey] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [joinPassKey, setJoinPassKey] = useState("");
//   const [rooms, setRooms] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchRooms = async () => {
//       const q = query(collection(db, "rooms"), orderBy("createdAt", "desc")); // Order by createdAt in descending order
//       const querySnapshot = await getDocs(q);
//       const roomsData = [];
//       querySnapshot.forEach((doc) => {
//         roomsData.push({ id: doc.id, ...doc.data() });
//       });
//       setRooms(roomsData);
//     };

//     fetchRooms();
//   }, []);

//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//   };

//   const toggleCreateRoom = () => {
//     setCreateRoomVisible(!createRoomVisible);
//     setMenuVisible(false);
//   };

//   const toggleJoinRoom = () => {
//     setJoinRoomVisible(!joinRoomVisible);
//     setMenuVisible(false);
//   };

//   const googleSignIn = () => {
//     const provider = new GoogleAuthProvider();
//     signInWithRedirect(auth, provider);
//   };

//   const signOut = () => {
//     auth.signOut();
//     setCurrentRoom(null); // Clear the current room on sign out
//   };

//   const createRoom = async () => {
//     if (roomName.trim() && passKey.trim()) {
//       const roomRef = await addDoc(collection(db, "rooms"), {
//         name: roomName,
//         passKey: passKey,
//         createdAt: serverTimestamp(),
//         createdBy: user.displayName,
//       });
//       setCurrentRoom({ id: roomRef.id, name: roomName });
//       setCreateRoomVisible(false);
//       setRoomName("");
//       setPassKey("");
//     } else {
//       alert(language === "en" ? "Please enter both room name and pass key." : "ルーム名とパスキーを入力してください。");
//     }
//   };

//   const joinRoom = () => {
//     if (joinPassKey === selectedRoom.passKey) {
//       setCurrentRoom(selectedRoom);
//       setJoinRoomVisible(false);
//       setSelectedRoom(null);
//       setJoinPassKey("");
//     } else {
//       alert(language === "en" ? "Invalid pass key. Please try again." : "無効なパスキーです。再試行してください。");
//     }
//   };

//   const filteredRooms = rooms.filter((room) =>
//     room.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <nav className="nav-bar">
//       <h1>{currentRoom ? `${language === "en" ? "Room" : "ルーム"}: ${currentRoom.name}` : "NihonGo"}</h1>
//       {user ? (
//         <>
//           <button onClick={toggleMenu} className="menu-toggle" type="button">
//             {language === "en" ? "Menu" : "メニュー"}
//           </button>
//           <button onClick={toggleLanguage} className="language-toggle">
//             {language === "en" ? "日本語へ切り替える" : "Switch to English"}
//           </button>
//           {menuVisible && (
//             <ul className="menu">
//               <li>
//                 <button onClick={toggleCreateRoom}>{language === "en" ? "Create Room" : "ルームを作成する"}</button>
//               </li>
//               <li>
//                 <button onClick={toggleJoinRoom}>{language === "en" ? "Join Room" : "ルームに参加する"}</button>
//               </li>
//               <li>
//                 <button onClick={signOut} type="button">
//                   {language === "en" ? "Sign Out" : "サインアウト"}
//                 </button>
//               </li>
//             </ul>
//           )}
//         </>
//       ) : (
//         <button className="sign-in">
//           <img
//             onClick={googleSignIn}
//             src={GoogleSignin}
//             alt={language === "en" ? "sign in with google" : "Googleでサインイン"}
//             type="button"
//           />
//         </button>
//       )}

//       {createRoomVisible && (
//         <div className="modal-overlay">
//           <div className="create-room">
//             <h2>{language === "en" ? "Create Room" : "ルームを作成する"}</h2>
//             <input
//               type="text"
//               placeholder={language === "en" ? "Enter room name" : "ルーム名を入力"}
//               value={roomName}
//               onChange={(e) => setRoomName(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder={language === "en" ? "Enter pass key" : "パスキーを入力"}
//               value={passKey}
//               onChange={(e) => setPassKey(e.target.value)}
//             />
//             <button onClick={createRoom}>{language === "en" ? "Create" : "作成"}</button>
//             <button onClick={() => setCreateRoomVisible(false)}>{language === "en" ? "Cancel" : "キャンセル"}</button>
//           </div>
//         </div>
//       )}

//       {joinRoomVisible && (
//         <div className="modal-overlay">
//           <div className="join-room">
//             <h2>{language === "en" ? "Join Room" : "ルームに参加する"}</h2>
//             {selectedRoom ? (
//               <>
//                 <p>{language === "en" ? "Enter pass key for room" : "ルームのパスキーを入力"}: {selectedRoom.name}</p>
//                 <input
//                   type="password"
//                   placeholder={language === "en" ? "Enter pass key" : "パスキーを入力"}
//                   value={joinPassKey}
//                   onChange={(e) => setJoinPassKey(e.target.value)}
//                 />
//                 <button onClick={joinRoom}>{language === "en" ? "Join" : "参加"}</button>
//                 <button onClick={() => setSelectedRoom(null)}>{language === "en" ? "Cancel" : "キャンセル"}</button>
//               </>
//             ) : (
//               <>
//                 <input
//                   type="text"
//                   placeholder={language === "en" ? "Search rooms" : "ルームを検索"}
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <ul>
//                   {filteredRooms.map((room) => (
//                     <li key={room.id}>
//                       <button onClick={() => setSelectedRoom(room)}>
//                         {room.name} - {language === "en" ? "Created by" : "作成者"} {room.createdBy} {language === "en" ? "on" : "作成日時"}{" "}
//                         {room.createdAt.toDate().toLocaleString()}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button onClick={() => setJoinRoomVisible(false)}>{language === "en" ? "Cancel" : "キャンセル"}</button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default NavBar;
import React, { useState, useEffect } from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth, db } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getDocs, query, addDoc, serverTimestamp, orderBy } from "firebase/firestore";

const NavBar = ({ currentRoom, setCurrentRoom, language, toggleLanguage }) => {
  const [user] = useAuthState(auth);
  const [menuVisible, setMenuVisible] = useState(false);
  const [createRoomVisible, setCreateRoomVisible] = useState(false);
  const [joinRoomVisible, setJoinRoomVisible] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [passKey, setPassKey] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [joinPassKey, setJoinPassKey] = useState("");
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      const q = query(collection(db, "rooms"), orderBy("createdAt", "desc")); // Order by createdAt in descending order
      const querySnapshot = await getDocs(q);
      const roomsData = [];
      querySnapshot.forEach((doc) => {
        roomsData.push({ id: doc.id, ...doc.data() });
      });
      setRooms(roomsData);
    };

    fetchRooms();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleCreateRoom = () => {
    setCreateRoomVisible(!createRoomVisible);
    setMenuVisible(false);
  };

  const toggleJoinRoom = () => {
    setJoinRoomVisible(!joinRoomVisible);
    setMenuVisible(false);
  };
  

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("User signed in:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Error during sign-in:", errorCode, errorMessage, email, credential);
      });
  };

  const signOut = () => {
    auth.signOut();
    setCurrentRoom(null); // Clear the current room on sign out
  };

  const createRoom = async () => {
    if (roomName.trim() && passKey.trim()) {
      const roomRef = await addDoc(collection(db, "rooms"), {
        name: roomName,
        passKey: passKey,
        createdAt: serverTimestamp(),
        createdBy: user.displayName,
      });
      setCurrentRoom({ id: roomRef.id, name: roomName });
      setCreateRoomVisible(false);
      setRoomName("");
      setPassKey("");
    } else {
      alert(language === "en" ? "Please enter both room name and pass key." : "ルーム名とパスキーを入力してください。");
    }
  };

  const joinRoom = () => {
    if (joinPassKey === selectedRoom.passKey) {
      setCurrentRoom(selectedRoom);
      setJoinRoomVisible(false);
      setSelectedRoom(null);
      setJoinPassKey("");
    } else {
      alert(language === "en" ? "Invalid pass key. Please try again." : "無効なパスキーです。再試行してください。");
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav className="nav-bar">
      <h1>{currentRoom ? `${language === "en" ? "Room" : "ルーム"}: ${currentRoom.name}` : "NihonGo"}</h1>
      {user ? (
        <>
          <button onClick={toggleMenu} className="menu-toggle" type="button">
            {language === "en" ? "Menu" : "メニュー"}
          </button>
          <button onClick={toggleLanguage} className="language-toggle">
            {language === "en" ? "日本語へ切り替える" : "Switch to English"}
          </button>
          {menuVisible && (
            <ul className="menu">
              <li>
                <button onClick={toggleCreateRoom}>{language === "en" ? "Create Room" : "ルームを作成する"}</button>
              </li>
              <li>
                <button onClick={toggleJoinRoom}>{language === "en" ? "Join Room" : "ルームに参加する"}</button>
              </li>
              <li>
                <button onClick={signOut} type="button">
                  {language === "en" ? "Sign Out" : "サインアウト"}
                </button>
              </li>
            </ul>
          )}
        </>
      ) : (
        <button className="sign-in">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt={language === "en" ? "sign in with google" : "Googleでサインイン"}
            type="button"
          />
        </button>
      )}

      {createRoomVisible && (
        <div className="modal-overlay">
          <div className="create-room">
            <h2>{language === "en" ? "Create Room" : "ルームを作成する"}</h2>
            <input
              type="text"
              placeholder={language === "en" ? "Enter room name" : "ルーム名を入力"}
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              type="password"
              placeholder={language === "en" ? "Enter pass key" : "パスキーを入力"}
              value={passKey}
              onChange={(e) => setPassKey(e.target.value)}
            />
            <button onClick={createRoom}>{language === "en" ? "Create" : "作成"}</button>
            <button onClick={() => setCreateRoomVisible(false)}>{language === "en" ? "Cancel" : "キャンセル"}</button>
          </div>
        </div>
      )}

      {joinRoomVisible && (
        <div className="modal-overlay">
          <div className="join-room">
            <h2>{language === "en" ? "Join Room" : "ルームに参加する"}</h2>
            {selectedRoom ? (
              <>
                <p>{language === "en" ? "Enter pass key for room" : "ルームのパスキーを入力"}: {selectedRoom.name}</p>
                <input
                  type="password"
                  placeholder={language === "en" ? "Enter pass key" : "パスキーを入力"}
                  value={joinPassKey}
                  onChange={(e) => setJoinPassKey(e.target.value)}
                />
                <button onClick={joinRoom}>{language === "en" ? "Join" : "参加"}</button>
                <button onClick={() => setSelectedRoom(null)}>{language === "en" ? "Cancel" : "キャンセル"}</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder={language === "en" ? "Search rooms" : "ルームを検索"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul>
                  {filteredRooms.map((room) => (
                    <li key={room.id}>
                      <button onClick={() => setSelectedRoom(room)}>
                        {room.name} - {language === "en" ? "Created by" : "作成者"} {room.createdBy} {language === "en" ? "on" : "作成日時"}{" "}
                        {room.createdAt.toDate().toLocaleString()}
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setJoinRoomVisible(false)}>{language === "en" ? "Cancel" : "キャンセル"}</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

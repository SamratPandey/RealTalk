import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import { useAuth } from "../authContext";

const SpaceDetails = () => {
  const { id } = useParams(); 
  const { user } = useAuth(); 
  const navigate = useNavigate(); 

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [spaceCreatorId, setSpaceCreatorId] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const spaceDoc = doc(db, "spaces", id);
        const spaceSnapshot = await getDoc(spaceDoc);
        if (spaceSnapshot.exists()) {
          const spaceData = spaceSnapshot.data();
          setSpaceCreatorId(spaceData.createdBy);
        }

        const messagesRef = collection(db, `spaces/${id}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });

        setLoading(false);
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching space data:", error);
      }
    };

    fetchSpaceData();
  }, [id, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, `spaces/${id}/messages`);
      await addDoc(messagesRef, {
        text: newMessage,
        sender: user.displayName || "Anonymous",
        timestamp: serverTimestamp(),
      });
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteSpace = async () => {
    try {
      const messagesRef = collection(db, `spaces/${id}/messages`);
      const querySnapshot = await getDocs(messagesRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      const spaceRef = doc(db, "spaces", id);
      await deleteDoc(spaceRef);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting space:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 text-white py-2 px-4 rounded-full mb-4 ml-4 hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Space Chat</h1>
        {user && spaceCreatorId === user.uid && (
          <button
            onClick={handleDeleteSpace}
            className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
          >
            Delete Space
          </button>
        )}
      </div>
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-4 ${
              msg.sender === user.displayName ? "justify-end" : ""
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xl text-white">{msg.sender[0]}</span>
              </div>
            </div>
            <div
              className={`p-3 rounded-lg max-w-xl ${
                msg.sender === user.displayName
                  ? "bg-green-300 text-black"
                  : "bg-gray-300 text-black"
              }`}
            >
              <div className="text-[13px] text-black font-semibold">{msg.sender}</div>
              <div className="text-lg font-bold">{msg.text}</div>
              <div className="text-xs text-black-500 mt-1">
              {msg.timestamp ? (
                new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                })
            ) : (
                <span>No timestamp available</span>
            )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white flex items-center border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SpaceDetails;

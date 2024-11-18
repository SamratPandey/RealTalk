import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useAuth } from "../authContext";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"; // Updated imports
import { FaSignOutAlt, FaPlusCircle, FaUserCircle, FaTrashAlt } from "react-icons/fa"; // Icons for actions

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      try {
        const spacesRef = collection(db, "spaces");
        const q = query(spacesRef, where("createdBy", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const spacesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpaces(spacesData);
      } catch (error) {
        console.error("Error fetching spaces:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSpaces();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteSpace = async (spaceId) => {
    try {
      // Use the correct method for deleting a document in Firebase v9+
      const spaceRef = doc(db, "spaces", spaceId); // Reference to the specific space
      await deleteDoc(spaceRef); // Delete the document

      // Update the UI to reflect the deletion
      setSpaces((prevSpaces) => prevSpaces.filter((space) => space.id !== spaceId));
    } catch (error) {
      console.error("Error deleting space:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-6 space-y-6">
        <div className="flex justify-center mb-8">
          <img
            src={user.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
        </div>
        <div className="space-y-4">
          <button
            className="w-full flex items-center space-x-4 py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
            onClick={() => navigate("/create-space")}
          >
            <FaPlusCircle size={20} />
            <span>Create a Space</span>
          </button>
          <button
            className="w-full flex items-center space-x-4 py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg transition duration-300"
            onClick={() => navigate("/join-space")}
          >
            <FaPlusCircle size={20} />
            <span>Join a Space</span>
          </button>
          <button
            className="w-full flex items-center space-x-4 py-3 px-6 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition duration-300"
            onClick={() => navigate("/update-profile")}
          >
            <FaUserCircle size={20} />
            <span>Update Profile</span>
          </button>
          <button
            className="w-full flex items-center space-x-4 py-3 px-6 bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        {/* Spaces Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Spaces</h2>
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin border-4 border-t-4 border-blue-500 w-8 h-8 rounded-full"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          ) : spaces.length > 0 ? (
            spaces.map((space) => (
              <div
                key={space.id}
                className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{space.name}</h3>
                  <p className="text-gray-600">{space.description}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteSpace(space.id)}
                  >
                    <FaTrashAlt size={20} />
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => navigate(`/space/${space.id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No spaces found. Create or join one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

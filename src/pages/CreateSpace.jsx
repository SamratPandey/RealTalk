import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../authContext";
import { FaPlusCircle } from "react-icons/fa"; // Add an icon for create action

const CreateSpace = () => {
  const [spaceName, setSpaceName] = useState("");
  const [spaceDescription, setSpaceDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!spaceName.trim()) {
      alert("Space name is required!");
      return;
    }
    setLoading(true);
    try {
      const spacesRef = collection(db, "spaces");
      const docRef = await addDoc(spacesRef, {
        name: spaceName,
        description: spaceDescription,
        createdBy: user.uid,
        timestamp: new Date(),
      });
      navigate(`/space/${docRef.id}`);
    } catch (error) {
      console.error("Error creating space:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create a New Space</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium">Space Name</label>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="Enter space name"
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium">Description (Optional)</label>
            <textarea
              value={spaceDescription}
              onChange={(e) => setSpaceDescription(e.target.value)}
              placeholder="Enter a brief description"
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2 border-t-2 border-white w-4 h-4 rounded-full"></span>
                  Creating...
                </>
              ) : (
                <>
                  <FaPlusCircle className="mr-2" size={20} />
                  Create Space
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSpace;

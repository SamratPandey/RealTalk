import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const JoinSpace = () => {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      try {
        const spacesRef = collection(db, "spaces");
        const q = query(spacesRef);
        const querySnapshot = await getDocs(q);
        const spacesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSpaces(spacesData);
        setFilteredSpaces(spacesData);
      } catch (error) {
        console.error("Error fetching spaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  // Handle the search input change and filter spaces
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredSpaces(
      spaces.filter(
        (space) =>
          (space.name && space.name.toLowerCase().includes(query)) ||
          (space.description && space.description.toLowerCase().includes(query))
      )
    );
  };

  const handleJoinSpace = (id) => {
    navigate(`/space/${id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">Join a Space</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search spaces..."
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loading indicator */}
        {loading ? (
          <div className="text-center text-gray-600">Loading available spaces...</div>
        ) : (
          <div className="space-y-6 mt-6">
            {filteredSpaces.length === 0 ? (
              <div className="text-center text-gray-600">No spaces available. Try again later.</div>
            ) : (
              filteredSpaces.map((space) => (
                <div
                  key={space.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">{space.name}</h2>
                  <p className="text-gray-600 mt-2">{space.description}</p>
                  <button
                    onClick={() => handleJoinSpace(space.id)}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Join Space
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinSpace;

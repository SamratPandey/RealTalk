import React from "react";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-2xl rounded-xl max-w-5xl w-full">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">Welcome to Real-Time Chat</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Communicate instantly with your friends and colleagues, and collaborate like never before.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          <div className="bg-blue-500 text-white p-8 rounded-xl shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105">
            <h2 className="text-3xl font-semibold">One-on-One Chat</h2>
            <p className="mt-3 text-lg">Start a private conversation with anyone, anytime, anywhere.</p>
          </div>
          <div className="bg-green-500 text-white p-8 rounded-xl shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105">
            <h2 className="text-3xl font-semibold">Create a Space</h2>
            <p className="mt-3 text-lg">Create dedicated chat rooms for groups to collaborate effectively.</p>
          </div>
          <div className="bg-purple-500 text-white p-8 rounded-xl shadow-lg hover:bg-purple-600 transition duration-300 transform hover:scale-105">
            <h2 className="text-3xl font-semibold">Real-Time Messaging</h2>
            <p className="mt-3 text-lg">Experience fast, seamless, and real-time communication with zero delays.</p>
          </div>
        </div>

        <div className="mt-10">
          <a
            href="/login"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

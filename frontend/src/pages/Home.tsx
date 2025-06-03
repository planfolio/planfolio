// src/pages/Home.tsx
import React from "react";
import Calendar from "../components/Calendar/Calendar";

const Home: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-pre font-semibold mb-4">DashBoard</h1>
      <Calendar />
    </div>
  );
};

export default Home;

import React from "react";
import MainBanner from "../../components/Banner/MainBanner";
import BottomBanner from "../../components/Banner/BottomBanner";
import UpcomingEvents from "../../components/UpcomingEvents/UpcomingEvents";

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <MainBanner />
      <UpcomingEvents />
      <BottomBanner />
    </div>
  );
};

export default Home;

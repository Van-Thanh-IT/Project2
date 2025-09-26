import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HomeIntro from "./HomeIntro";

const UserMainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <HomeIntro/>
      </main>
      <Footer />
    </>
  );
};

export default UserMainLayout;

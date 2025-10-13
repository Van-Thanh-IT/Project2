import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HomeIntro from "./HomeIntro";
import ScrollToTop from "./ScrollToTop";

const UserMainLayout = () => {
  return (
    <>
      <Header />
      <ScrollToTop/>
      <main>
        <Outlet />
        <HomeIntro/>
      </main>
      <Footer />
    </>
  );
};

export default UserMainLayout;

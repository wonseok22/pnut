import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../UI/NavBar";
import Footer from "../UI/Footer";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex flex-col mt-60">
        <Outlet />
      </main>
      <Footer className="relative z-50" />
    </div>
  );
};

export default RootLayout;

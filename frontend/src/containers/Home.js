import React, { useEffect, useState, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Routes, Route } from "react-router-dom";

import { Sidebar, UserProfile } from "../components/index.js";
import Pins from "./Pins.jsx";
import { client } from "../client";
import logo from "../assets/logo.png";
import { userQuery } from "../utils/data.js";

const Home = () => {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  //get our user info from local storage, if it does not exist or there is an issue, clear the storage
  const userInfo =
    localStorage.getItem("token") !== "undefined"
      ? JSON.parse(localStorage.getItem("token"))
      : localStorage.clear();

  useEffect(() => {
    //get our id from the local storage, from token obj
    const query = userQuery(userInfo?.clientId);
    //use this to access our user from sanity
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userInfo.clientId]);

  useEffect(() => {
    //make sure that the page is scrolled to the top of the page on loading
    scrollRef.current.scrollTo = 0;
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} closeToggle={setToggleSideBar} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSideBar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="profile" className="w-28" />
          </Link>
        </div>
      </div>
      {toggleSideBar && (
        <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-index-10 animate-slide-in">
          <div className="absolute w-full flex justify-end items-center p-2">
            <AiFillCloseCircle
              fontSize={30}
              className="cursor-pointer"
              onClick={() => setToggleSideBar(false)}
            />
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSideBar} />
        </div>
      )}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;

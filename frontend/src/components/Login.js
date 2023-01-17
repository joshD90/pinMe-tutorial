import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logowhite from "../assets/logowhite.png";
import jwt_decode from "jwt-decode";

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();
  let user = false;

  const doResponse = (resObj) => {
    //once we get our response we set the token in local storage
    localStorage.setItem("token", JSON.stringify(resObj));
    //we also want to decode this token to extract user information and store this in localstorage
    const decoded = jwt_decode(resObj.credential);

    localStorage.setItem("userProfile", JSON.stringify(decoded));
    //extract our client ID
    const { clientId } = resObj;

    const { picture, name } = decoded;
    //create a user within our CMS
    const doc = {
      _id: clientId,
      _type: "user",
      userName: name,
      image: picture,
    };
    //only create a new user if the user does not already exist. this calls a sanity function
    client.createIfNotExists(doc).then(() => {
      //navigate to our homepage
      navigate("/", { replace: true });
    });
  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          controls={false}
          muted
          autoPlay
          loop
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
        <div className="p-5">
          <img src={logowhite} width="130px" alt="logo" />
        </div>
        <div className="shadow-2xl">
          {/* from documentation */}
          {user ? (
            <div>LOGGED IN</div>
          ) : (
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                doResponse(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              className="rounded-lg p-5"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

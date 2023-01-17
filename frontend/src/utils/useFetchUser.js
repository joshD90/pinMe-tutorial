import { useEffect, useState } from "react";

import { userQuery } from "./data";
import { client } from "../client";

//this grabs our client id from the what was returned from google
export const fetchUser = () => {
  const userId =
    localStorage.getItem("token") !== "undefined"
      ? JSON.parse(localStorage.getItem("token"))
      : localStorage.clear();
  return userId;
};
//we export a custom hook which holds a useEffect which fetches the data from sanity
export const useFetchUser = (id) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //get our id from the local storage, from token obj
    const query = userQuery(id);
    //use this to access our user from sanity
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [id]);

  return user;
};

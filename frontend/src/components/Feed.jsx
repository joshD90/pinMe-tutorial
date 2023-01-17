import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { searchQuery, feedQuery } from "../utils/data";
const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();
  //request pins from CMS depending on our paramaters
  useEffect(() => {
    //turn on our loading spinner
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((res) => {
        setPins(res);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((res) => {
        setPins(res);
        setLoading(false);
      });
    }
  }, [categoryId]);
  if (loading)
    return <Spinner message="We are adding new Ideas to Your Feed!" />;
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;

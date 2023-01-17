import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { urlFor, client } from "../client";
import { fetchUser } from "../utils/useFetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();

  //get our user's id
  const { clientId } = fetchUser();
  //check this against the save array
  const alreadySaved = !!save?.filter((item) => item.postedBy._id === clientId)
    ?.length;
  //adding liked functionality.  This will tell the number of people who have liked a pin
  const savePin = (id) => {
    if (alreadySaved) return;

    //get the user
    client
      .patch(id)
      //add in empty array if null
      .setIfMissing({ save: [] })
      //insert new 'save' doc at end
      .insert("after", "save[-1]", [
        {
          _key: uuidv4(),
          userId: clientId,
          postedBy: {
            _type: "postedBy",
            _ref: clientId,
          },
        },
      ])
      .commit()
      .then(() => {
        window.location.reload();
      });
  };
  //user can delete the pin if it is theirs
  const deletePin = (id) => {
    //delete the pin by id and then reload page to see the effect thats taken place
    client.delete(id).then(() => window.location.reload());
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          className="rounded-lg w-full"
          alt="user-post"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.length > 20
                    ? destination.slice(8, 20)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === clientId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="poster profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;

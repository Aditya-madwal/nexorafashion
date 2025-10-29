import React, { useEffect, useState } from "react";
import api from "../api";
import { useContext } from "react";
import { MyContext } from "../MyContext";

const Home = () => {
  const { me, setMe } = useContext(MyContext);
  const [myinfo, setMyinfo] = useState(null);
  useEffect(() => {
    me ? setMyinfo(me) : null;
  }, [me]);

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div>{myinfo?.username}</div>
        <div>{myinfo?.email}</div>
      </div>
    </>
  );
};

export default Home;

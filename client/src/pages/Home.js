import React, { useContext } from "react";
import { UidContext } from "../components/AppContext";
import LeftNav from "../components/LeftNav";
import NewPostForm from "../components/Post/NewPostForm";
import Log from "../components/Log/index";
import Thread from "../components/Thread";
import Trends from "../components/Trends";
import FriendHint from "../components/Profil/FriendHint";

const Home = () => {
  const uid = useContext(UidContext);

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="home-header">
          {uid ? <NewPostForm /> : <Log signin={true} signup={false} />}
        </div>
        <Thread />
      </div>
      <div className="right-side">
        <div className="right-side-container">
          <div className="wraper">
            <Trends />
            {uid && <FriendHint/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

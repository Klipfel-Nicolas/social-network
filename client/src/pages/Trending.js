import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { UidContext } from "../components/AppContext";
import { isEmpty } from "../components/Utils";
import LeftNav from "../components/LeftNav";
import Card from "../components/Post/Card";
import Trends from "../components/Trends";
import FriendHint from "../components/Profil/FriendHint";

const Trending = () => {
  const uid = useContext(UidContext);
  const trendList = useSelector((state) => state.trendingReducer);

  return (
    <div className="trending-page">
      <LeftNav />
      <div className="main">
        <ul>
          {!isEmpty(trendList[0]) &&
            trendList.map((post) => <Card post={post} key={post._id} />)}
        </ul>
      </div>
      
      <div className="right-side">
        <div className="right-side-container">
          <Trends />
          {uid && <FriendHint />}
        </div>
      </div>
    </div>
  );
};

export default Trending;

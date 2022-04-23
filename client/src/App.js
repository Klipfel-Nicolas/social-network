import React, { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext";
import Routes from "./components/Routes";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  //On lance une requet a requireAuth de l api pour voir si le user est connecter et on recupere sont token pour le mettre dans uid
  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
        .then((res) => {
          //On set l'id dans le context uid pour y avoir accès dans toute l'appplication
          setUid(res.data)
        })
        .catch((err) => console.log("No token"));
    };
    fetchToken();

     if(uid) dispatch(getUser(uid)) //On enovie au getUser dans user.actions pour redux
  }, [uid, dispatch]);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;

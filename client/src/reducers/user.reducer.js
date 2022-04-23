import {
  FOLLOW_USER,
  GET_USER,
  UNFOLLOW_USER,
  UPDATE_BIO,
  UPLOAD_PICTURE,
} from "../actions/user.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.payload; //Si c'est l'action GET_USER on rempli initial state avec le payload de getUser()
    case UPLOAD_PICTURE:
      return {
        ...state, // On recupère ce qui existe, on ne l'ecrase pas
        picture: action.payload,
      };
    case UPDATE_BIO:
      return {
        ...state, // On recupère ce qui existe, on ne l'ecrase pas
        bio: action.payload,
      };
    case FOLLOW_USER:
      return {
        ...state, // On recupère ce qui existe, on ne l'ecrase pas
        followings: [action.payload.idToFollow, ...state.followings],
      };
    case UNFOLLOW_USER:
      return {
        ...state, // On recupère ce qui existe, on ne l'ecrase pas
        followings: state.followings.filter(
          (id) => id !== action.payload.idToUnfollow  //id cliquer n'est pas remis dans le nouveau tableau ce qui fait qu il est retirer des followings
        ),
      };

    default:
      return state;
  }
}

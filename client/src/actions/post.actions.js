import axios from "axios";

//Posts
export const GET_POSTS = "GET_POSTS";
export const GET_ALL_POSTS = "GET_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

//comments
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

//trends
export const GET_TRENDS = "GET_TRENDS";

//errors
export const GET_POST_ERRORS = "GET_POST_ERRORS";

/**
 *
 * @returns posts
 */
export const getPosts = (num) => {
  return (dispatch) => {
    return axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/post/`,
    })
      .then((res) => {
        const arrayPost = res.data.slice(0, num); //Pour en retourné un certain nombre (infinit scroll)
        dispatch({ type: GET_POSTS, payload: arrayPost });
        dispatch({ type: GET_ALL_POSTS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

/**
 *
 * @returns posts
 */
export const addPosts = (data) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/post/`,
      data: data,
    }).then((res) => {
      if (res.data.errors) {
        dispatch({ type: GET_POST_ERRORS, payload: res.data.errors });
      } else {
        dispatch({ type: GET_POST_ERRORS, payload: "" });
      }
    });
  };
};

/**
 * LIKE
 * @param {*} postId
 * @param {*} userId
 * @returns
 */
export const likePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/like-post/` + postId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: LIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

/**
 * UNLIKE
 * @param {*} postId
 * @param {*} userId
 * @returns
 */
export const unlikePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/unlike-post/` + postId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: UNLIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

/**
 * UPDATE POST
 * @param {*} postId
 * @param {*} message to update
 * @returns
 */
export const updatePost = (postId, message) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
      data: { message },
    })
      .then((res) => {
        dispatch({ type: UPDATE_POST, payload: { message, postId } });
      })
      .catch((err) => console.log(err));
  };
};

/**
 * DELETE POST
 * @param {*} postId
 * @param {*} message to update
 * @returns
 */
export const deletePost = (postId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
    })
      .then((res) => {
        dispatch({ type: DELETE_POST, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

/**
 * ADD_COMMENT
 * @param {*} postId
 * @param {*} commenterId
 * @param {*} text
 * @param {*} commenterPseudo
 * @returns
 */
export const addComment = (postId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/comment-post/${postId}`,
      data: { commenterId, text, commenterPseudo },
    })
      .then((res) => {
        dispatch({ type: ADD_COMMENT, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

/**
 * EDIT_COMMENT
 * @param {*} postId
 * @param {*} commenterId
 * @param {*} text
 * @returns
 */
export const editComment = (postId, commentId, text) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/edit-comment-post/${postId}`,
      data: { commentId, text },
    })
      .then((res) => {
        dispatch({ type: EDIT_COMMENT, payload: { postId, commentId, text } });
      })
      .catch((err) => console.log(err));
  };
};

/**
 * DELETE_COMMENT
 * @param {*} postId
 * @param {*} commenterId
 * @returns
 */
export const deleteComment = (postId, commentId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/delete-comment-post/${postId}`,
      data: { commentId },
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENT, payload: { postId, commentId } });
      })
      .catch((err) => console.log(err));
  };
};

export const getTrends = (sortedArray) => {
  return (dispatch) => {
    dispatch({ type: GET_TRENDS, payload: sortedArray });
  };
};

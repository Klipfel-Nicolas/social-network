import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import "./styles/index.scss";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { getUsers } from "./actions/users.actions";

//devTools à retirer en prod pour pas que les client ai accès
import { composeWithDevTools } from "redux-devtools-extension";
import { getPosts } from "./actions/post.actions";
/* import  logger from 'redux-logger'; */

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk /* , logger */))
);

store.dispatch(getUsers());
store.dispatch(getPosts());

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

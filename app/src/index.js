import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "react-alice-carousel/lib/alice-carousel.css";
import CryptoContext from "./CryptoContext";
import { store } from "./store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>    
    <Provider store={store}>
    <CryptoContext>
      <App />
    </CryptoContext>    
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import StreetScene from "./components/StreetScene";
import NewsFeed from "./components/NewsFeed";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <StreetScene />
      <NewsFeed />
    </div>
  </React.StrictMode>,
);

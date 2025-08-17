// src/App.jsx (unchanged from your fixed version)
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import NewsFeed from "./components/NewsFeed.jsx";
import StreetScene from "./components/StreetScene.jsx";

function About()   { return <div className="p-6">About page</div>; }
function Gallery() { return <div className="p-6">Gallery page</div>; }

export default function App() {
    const chrome = {
        left:  <StreetScene variant="buildings" />,
        right: <StreetScene variant="street" />
    };

    return (
        <Routes>
            <Route path="/"        element={<Layout {...chrome}><NewsFeed /></Layout>} />
            <Route path="/about"   element={<Layout {...chrome}><About /></Layout>} />
            <Route path="/gallery" element={<Layout {...chrome}><Gallery /></Layout>} />
            <Route path="*"        element={<Layout {...chrome}><NewsFeed /></Layout>} />
        </Routes>
    );
}
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import NewsFeed from "./components/NewsFeed.jsx";        // you already have this
import StreetScene from "./components/StreetScene.jsx";  // you already have this
import ScenePanel from "./components/ScenePanel.jsx";


// Placeholder pages you can replace later
function About() { return <div className="p-6">About page</div>; }
function Gallery() { return <div className="p-6">Gallery page</div>; }

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Layout
                        left={<StreetScene variant="buildings" />}
                        right={<StreetScene variant="street" />}
                    >
                        <NewsFeed />
                    </Layout>
                }
            />
            <Route
                path="/about"
                element={
                    <Layout
                        left={<StreetScene variant="buildings" />}
                        right={<StreetScene variant="street" />}
                    >
                        <About />
                    </Layout>
                }
            />
            <Route
                path="/gallery"
                element={
                    <Layout
                        left={<StreetScene variant="buildings" />}
                        right={<StreetScene variant="street" />}
                    >
                        <Gallery />
                    </Layout>
                }
            />
        </Routes>
    );
}
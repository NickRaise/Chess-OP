import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./screens/Landing";
import Game from "./screens/Game";
import Auth from "./screens/Auth";
function App() {
    return (
        <div className="bg-gray-900 h-screen ">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing/>} />
                    <Route path="/game" element={<Game/>} />
                    <Route path="/auth" element={<Auth/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

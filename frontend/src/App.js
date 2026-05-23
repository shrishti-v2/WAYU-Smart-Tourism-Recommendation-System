import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Planner from "./pages/Planner";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import SavedTrips from "./pages/SavedTrips";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved-trips" element={<SavedTrips />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
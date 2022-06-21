import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AtuhProvider } from "../contexts/AuthContext";
import "../styles/App.css";
import Layout from "./Layout";
import Home from "./pages/Home.js";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Signup from "./pages/Signup";
import PrivateRoute from "./PrivateRoute";
import PublicRout from "./PublicRout";

function App() {
  return (
    <BrowserRouter>
      <AtuhProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<PublicRout><Signup /></PublicRout>} />
            <Route path="/login" element={<PublicRout><Login /></PublicRout>} />
            <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
            <Route path="/result/:id" element={<PrivateRoute><Result /></PrivateRoute>} />
          </Routes>
        </Layout>
      </AtuhProvider>
    </BrowserRouter>
  );
}

export default App;

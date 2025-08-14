import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Principal from "./pages/Principal";
import Cadastro from "./pages/Cadastro";

export default function app () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </Router>
  )
}
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Principal from "./pages/Principal";
import Cadastro from "./pages/Cadastro";
import {UsuarioProvider} from "./UsuarioContext";

export default function app () {
  return (
    <UsuarioProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/*" element={<Principal />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </Router>
    </UsuarioProvider>
  )
}
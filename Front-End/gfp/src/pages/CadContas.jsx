import React, { useState, useEffect, useContext} from 'react'
import { UsuarioContext } from '../UsuarioContext.jsx'
import { enderecoServidor } from '../utils.jsx'
import { MdCreditCard, MdClose, MdSave } from 'react-icons/md'
import { useNavigate, useLocation } from 'react-router-dom'
import Estilos from "../styles/Estilos.jsx"

export default function cadContas() {
    const { dadosUsuario } = useContext(UsuarioContext)

    const navigate = useNavigate()
    const location = useLocation()

    return(
        <div>
            <h1>teste</h1>
        </div>
    )
}
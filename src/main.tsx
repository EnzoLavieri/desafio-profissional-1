import {  createBrowserRouter, RouterProvider } from "react-router";
import  React  from 'react'
import { createRoot } from 'react-dom/client'

import Login from './pages/Login.tsx'
import Cadastro from './pages/Cadastro.tsx'
import ContasAtivas from './pages/ContasAtivas.tsx'
import Home from './pages/Home.tsx'
import Grafico from './pages/Grafico.tsx'
import Upload from './pages/Upload.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Processamento from './pages/Processamento.tsx'
import CadastroUsuario from './pages/CadastroUsuario.tsx'

const router = createBrowserRouter([

  {path:'/login', element:<Login/>},
  {path:'/cadastro', element:<Cadastro/>},
  {path:'/contasAtivas', element:<ContasAtivas/>},
  {path:'/home', element:<Home/>},
  {path:'/grafico', element:<Grafico/>},
  {path:'/upload', element:<Upload/>},
  {path:'/dashboard', element:<Dashboard/>},
  {path:'/processamento', element:<Processamento/>},
  {path:'/cadastroUsuario', element:<CadastroUsuario/>},

])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

import Dashboard from "./pages/Dashboard";
import CadastroUsuario from "./pages/CadastroUsuario";
import ContasAtivas from "./pages/ContasAtivas";
import Grafico from "./pages/Grafico";
import ProcessamentoDRE from "./pages/Processamento";
import UploadDRE from "./pages/Upload";

export const routes = [
  { path: "/dashboard", element: <Dashboard />, title: "Dashboard" },
  { path: "/cadastrousuarios", element: <CadastroUsuario />, title: "Cadastrar usuario" },
  { path: "/contasativas", element: <ContasAtivas />, title: "Contas ativas" },
  { path: "/grafico", element: <Grafico />, title: "Gráfico" },
  { path: "/processamentodre", element: <ProcessamentoDRE />, title: "Processamendo DRE" },
  { path: "/uploaddre", element: <UploadDRE />, title: "Upload DRE", },
];
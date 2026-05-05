import { Link, NavLink } from "react-router-dom";


export default function Aside() {
  return (
    <aside className="aside">
      <div>
        <h2 className="logo">AutoDRE</h2>
      </div>
      <nav>
        <ul>
          <p>Informações</p>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><Link to="/grafico">Gráfico</Link></li>
          <p>DRE</p>
          <li><Link to="/processamentodre">Processamento</Link></li>
          <li><Link to="/uploaddre">Upload</Link></li>
          <p>Configurações</p>
          <li><Link to="/cadastrousuarios">Cadastro de usuario</Link></li>
          <li><Link to="/contasativas">Contas ativas</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
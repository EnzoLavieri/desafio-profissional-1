import { Link, NavLink } from "react-router-dom";

export default function Aside() {

  function AsideSection({ title, children }) {
    return (
      <div className="aside-section">
        <p className="aside-title">{title}</p>
        <nav>
          <ul>{children}</ul>
        </nav>
      </div>
    );
  }
  return (
    <aside className="aside">
      <div className="logo">AutoDRE</div>

      <AsideSection title="Informações">
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/grafico">Gráfico</NavLink></li>
      </AsideSection>

      <AsideSection title="DRE">
        <li><NavLink to="/processamentodre">Processamento</NavLink></li>
        <li><NavLink to="/uploaddre">Upload</NavLink></li>
      </AsideSection>

      <AsideSection title="Configurações">
        <li><NavLink to="/cadastrousuarios">Cadastro de usuário</NavLink></li>
        <li><NavLink to="/contasativas">Contas ativas</NavLink></li>
      </AsideSection>
    </aside>
  );
}
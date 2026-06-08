// EmpresaCard.tsx

import { Building2, Calendar, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Company {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  endereco: string;
  telefone: string;
}

interface EmpresaCardProps {
  company: Company;
}

function EmpresaCard({ company }: EmpresaCardProps) {
  const navigate = useNavigate();

  console.log(company)

  return (
    <div
      className="group p-5 bg-accent/30 hover:bg-accent/50 border border-border/50 rounded-xl transition-all cursor-pointer"
      onClick={() => navigate(`/dashboardfinanceiro/${company.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-foreground">
              {company.nome}
            </h4>

            {/* <span className="px-2 py-1 text-xs rounded-full border">
              {company.status}
            </span> */}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {company.cnpj}
            </span>

            {/* <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Última atualização: {company.lastUpdate}
            </span> */}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Enviar DRE
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Relatórios
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmpresaCard;
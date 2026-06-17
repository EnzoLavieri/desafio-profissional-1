// EmpresaCard.tsx

import { Building2, Calendar, FileText, PinIcon } from 'lucide-react';
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

function formatarCNPJ(cnpj) {
  const numeros = cnpj.replace(/\D/g, '');

  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
    '$1.$2.$3/$4-$5'
  );
}

 function EmpresaCard({ company }: EmpresaCardProps) {
  const navigate = useNavigate();

  const handleViewReports = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigate(`/relatorios/${company.id}`, {
      state: {
        companyNome: company.nome,
        companyCnpj: formatarCNPJ(company.cnpj),
        companyId: company.id,
      },
    });
  };

  return (
    <div
      className="group p-5 bg-accent/30 hover:bg-accent/50 border border-gray-300 border-border/50 rounded-xl transition-all cursor-pointer"
      onClick={() =>
        navigate(`/dashboardfinanceiro/${company.id}`, {
          state: {
            companyNome: company.nome,
            companyCnpj: formatarCNPJ(company.cnpj),
          },
        })
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4
              className="font-semibold text-foreground"
              style={{ fontSize: '18px' }}
            >
              {company.nome}
            </h4>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground text-gray-500">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {formatarCNPJ(company.cnpj)}
            </span>

            <p>|</p>

            <span className="flex items-center gap-1">
              <PinIcon className="w-4 h-4" />
              {company.endereco}
            </span>
          </div>
        </div>

        {/* Botão de relatórios */}
        <button
          onClick={handleViewReports}
          className="ml-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Relatórios
        </button>
      </div>
    </div>
  );
}

export default EmpresaCard;
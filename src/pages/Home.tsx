import { Building2, Plus, Upload, FileText, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Company {
  id: string;
  cnpj: string;
  name: string;
  lastUpdate: string;
  status: 'active' | 'pending' | 'inactive';
}

interface DashboardHomeProps {
  onNavigate: (screen: string, cnpj?: string) => void;
}

export default function Home({ onNavigate }: DashboardHomeProps) {
  const [companies] = useState<Company[]>([
    {
      id: '1',
      cnpj: '12.345.678/0001-90',
      name: 'Empresa Exemplo Ltda',
      lastUpdate: '15/05/2026',
      status: 'active'
    },
    {
      id: '2',
      cnpj: '98.765.432/0001-10',
      name: 'Comércio ABC S.A.',
      lastUpdate: '10/05/2026',
      status: 'active'
    },
    {
      id: '3',
      cnpj: '11.222.333/0001-44',
      name: 'Serviços XYZ ME',
      lastUpdate: '05/05/2026',
      status: 'pending'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'inactive':
        return 'Inativo';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">FinanceView</h1>
                <p className="text-sm text-muted-foreground">Análise Financeira DRE</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('settings')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Configurações
              </button>
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">AD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-muted-foreground">
            Selecione uma empresa ou adicione uma nova para começar a análise
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-chart-1/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-chart-1" />
              </div>
              <span className="text-2xl font-semibold text-foreground">
                {companies.length}
              </span>
            </div>
            <h3 className="text-sm text-muted-foreground">Empresas Cadastradas</h3>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-chart-2" />
              </div>
              <span className="text-2xl font-semibold text-foreground">12</span>
            </div>
            <h3 className="text-sm text-muted-foreground">DREs Processadas</h3>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chart-3" />
              </div>
              <span className="text-2xl font-semibold text-foreground">87%</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Taxa de Sucesso</h3>
          </div>
        </div>

        {/* Companies List */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Suas Empresas</h3>
            <button
              onClick={() => onNavigate('cnpj-management')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Empresa
            </button>
          </div>

          <div className="space-y-3">
            {companies.map((company) => (
              <div
                key={company.id}
                className="group p-5 bg-accent/30 hover:bg-accent/50 border border-border/50 rounded-xl transition-all cursor-pointer"
                onClick={() => onNavigate('financial-dashboard', company.cnpj)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{company.name}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                          company.status
                        )}`}
                      >
                        {getStatusLabel(company.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {company.cnpj}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Última atualização: {company.lastUpdate}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('upload', company.cnpj);
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Enviar DRE
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('reports', company.cnpj);
                      }}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Relatórios
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

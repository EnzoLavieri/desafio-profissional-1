import {
  Building2,
  Plus,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmpresaCard from '../components/EmpresaCard';

interface Company {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  endereco: string;
  telefone: string;
}

export default function Home() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      console.log(token)

      const userid = localStorage.getItem('userId');
      console.log(userid)

      const response = await axios.get(
        `http://localhost:3000/api/usuarios/listar-cnpjs/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(response)

      // Ajuste conforme o retorno real da API
      const empresas = response.data.flatMap((usuario: any) =>
        usuario.empresas.map((empresa: any) => ({
          id: empresa.id,
          nome: empresa.nome,
          email: empresa.email,
          cnpj: empresa.cnpj,
          endereco: empresa.endereco,
          telefone: empresa.telefone
        }))
      );

      setCompanies(empresas);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        {/* ... */}
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
            <h3 className="text-sm text-muted-foreground">
              Empresas Cadastradas
            </h3>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-chart-2" />
              </div>
              <span className="text-2xl font-semibold text-foreground">
                12
              </span>
            </div>
            <h3 className="text-sm text-muted-foreground">
              DREs Processadas
            </h3>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chart-3" />
              </div>
              <span className="text-2xl font-semibold text-foreground">
                87%
              </span>
            </div>
            <h3 className="text-sm text-muted-foreground">
              Taxa de Sucesso
            </h3>
          </div>
        </div>

        {/* Companies List */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Suas Empresas
            </h3>

            <button
              onClick={() => navigate('/editcompany')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Empresa
            </button>
          </div>

          {loading ? (
            <p>Carregando empresas...</p>
          ) : companies.length > 0 ? (
            <div className="space-y-3">
              {companies.map((company) => (
                <EmpresaCard
                  key={company.id}
                  company={company}
                />
              ))}
            </div>
          ) : (
            <p>Nenhuma empresa cadastrada.</p>
          )}
        </div>
      </main>
    </div>
  );
}
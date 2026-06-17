import {
  Building2,
  Plus,
  FileText,
  TrendingUp,
  LogOut,
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

      {/* <main className="max-w-7xl mx-auto px-6 py-8"> */}
      {/* Welcome Section */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black border border-white rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">FinanceView</h1>
                <p className="text-sm text-muted-foreground">Análise Financeira DRE</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Configurações
              </button>
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">AD</span>
              </div>
              <LogOut onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login');
              }} />
            </div>
          </div>
        </div>
      </header>


      {/* Quick Stats */}
      <div className="py-10 px-60">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-muted-foreground">
            Selecione uma empresa ou adicione uma nova para começar a análise
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-gray-300 border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-100 border border-white rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-2xl font-semibold text-foreground">
                {companies.length}
              </span>
            </div>
            <h3 className="text-sm text-muted-foreground">
              Empresas Cadastradas
            </h3>
          </div>

          <div className="bg-card border border-gray-300 border-border rounded-xl p-6">
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

          <div className="bg-card border border-gray-300 border-border rounded-xl p-6">
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
        <div className="bg-card border border-gray-300 border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Suas Empresas
            </h3>

            {companies.length > 0 &&
              <button
                onClick={() => navigate('/editcompany')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-lg hover:bg-primary/90 transition-colors "
              >
                <Plus className="w-4 h-4" />
                Nova Empresa
              </button>}

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
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-5">
                <Building2 className="w-10 h-10 text-orange-500" />
              </div>

              <h4 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma empresa encontrada
              </h4>

              <p className="text-muted-foreground max-w-md mb-6">
                Você ainda não possui empresas cadastradas.
                Adicione sua primeira empresa para começar a analisar seus dados financeiros.
              </p>

              <button
                onClick={() => navigate('/editcompany')}
                className=" flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Empresa
              </button>
            </div>
          )}
        </div>
      </div>
      {/* </main> */}
    </div>
  );
}
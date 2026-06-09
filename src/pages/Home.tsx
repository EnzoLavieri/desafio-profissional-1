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
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
    {/* Header */}
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Gestão financeira empresarial
          </p>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Bem-vindo de volta!
            </h2>

            <p className="text-muted-foreground">
              Gerencie suas empresas, acompanhe análises financeiras e tenha todos os indicadores em um único lugar.
            </p>
          </div>

          <button
            onClick={() => navigate('/editcompany')}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nova Empresa
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="group bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Empresas
              </p>

              <h3 className="text-4xl font-bold">
                {companies.length}
              </h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="group bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                DREs Processadas
              </p>

              <h3 className="text-4xl font-bold">12</h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="group bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Taxa de Sucesso
              </p>

              <h3 className="text-4xl font-bold">87%</h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-violet-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-semibold">
              Suas Empresas
            </h3>

            <p className="text-muted-foreground">
              Selecione uma empresa para continuar
            </p>
          </div>

          <button
            onClick={() => navigate('/editcompany')}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Empresa
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="transition-all hover:scale-[1.01]"
              >
                <EmpresaCard company={company} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Building2 className="w-10 h-10 text-primary" />
            </div>

            <h4 className="text-xl font-semibold mb-2">
              Nenhuma empresa cadastrada
            </h4>

            <p className="text-muted-foreground max-w-md mb-6">
              Cadastre sua primeira empresa para começar a processar
              DREs e visualizar indicadores financeiros.
            </p>

            <button
              onClick={() => navigate('/editcompany')}
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              Cadastrar primeira empresa
            </button>
          </div>
        )}
      </section>
    </main>
  </div>
);
}
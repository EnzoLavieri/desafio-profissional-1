import {
  Building2,
  Plus,
  FileText,
  TrendingUp,
  LogOut,
  LoaderCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmpresaCard from '../components/EmpresaCard';
import Loading from '../components/Loading';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
  const [relatorios, setRelatorios] = useState();
  const [relatoriosSeparados, setRelatoriosSeparados] = useState();

  useEffect(() => {
    carregarEmpresas();
    carregarRelatorios()
  }, []);

  const token = localStorage.getItem('token');
  console.log(token)

  const userid = localStorage.getItem('userId');
  console.log(userid)

  const carregarEmpresas = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      // console.log(token)

      const userid = localStorage.getItem('userId');
      // console.log(userid)

      const response = await axios.get(
        `http://localhost:3000/api/usuarios/listar-cnpjs/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // console.log(response)

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

  const carregarRelatorios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/google/buscar-todos-dre/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ); 
      const relatorios = response.data.resultado.length
      setRelatorios(relatorios);

      const relatoriosPorEmpresa = response.data.resultado.reduce(
        (acc: Record<string, any[]>, relatorio: any) => {
          const empresaId = relatorio.empresaId;

          if (!acc[empresaId]) {
            acc[empresaId] = [];
          }

          acc[empresaId].push(relatorio);

          return acc;
        },
        {}
      );
      setRelatoriosSeparados(relatoriosPorEmpresa);
      return relatorios;
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  }


  // console.log("relatorios separdos",relatoriosSeparados)

  const dadosGrafico = Object.entries(relatoriosSeparados || {}).map(
    ([empresaId, relatorios]) => {
      const relatorio = relatorios[0];

      const empresa = companies.find(
        (c) => c.id === (empresaId)
      );

      const lucro =
        Number(relatorio?.dados?.lucro_liquido?.[0]?.valor || 0);

      const despesa =
        Number(relatorio?.dados?.despesas?.[0]?.valor_total_despesas || 0);

      return {
        empresa: empresa?.nome || `Empresa ${empresaId}`,
        lucro,
        despesa,
      };
    }
  );
  // console.log("empresas",companies);
  // console.log("dados grafico",dadosGrafico);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        {/* ... */}
      </header>

      {/* <main className="max-w-7xl mx-auto px-6 py-8"> */}
      {/* Welcome Section */}
      <header className="bg-card border-b border-border sticky top-0 z-10  bg-white">
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Gráfico */}
          <div
            className="flex-1"
            style={{
              height: "300px",
              border: "1px solid #ccc",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosGrafico}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid stroke="#cfcfcf" vertical={false} />

                <XAxis
                  dataKey="empresa"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                />

                <YAxis />

                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(value)
                  }
                />

                <Legend
                  verticalAlign="top"
                  align="center"
                />

                <Bar
                  dataKey="lucro"
                  name="Lucro Líquido"
                  fill="#5B9BD5"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="despesa"
                  name="Despesas"
                  fill="#C0504D"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cards */}
          <div className="w-full lg:w-72 flex flex-col" style={{ justifyContent: "space-between" }}>
            <div className="bg-card border border-gray-300 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-orange-100 border border-white rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-2xl font-semibold">
                  {companies.length}
                </span>
              </div>
              <h3 className="text-sm text-muted-foreground">
                Empresas Cadastradas
              </h3>
            </div>

            <div className="bg-card border border-gray-300 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-chart-2/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-chart-2" />
                </div>
                <span className="text-2xl font-semibold">
                  {relatorios}
                </span>
              </div>
              <h3 className="text-sm text-muted-foreground">
                DREs Processadas
              </h3>
            </div>
          </div>
        </div>


        {/* Companies List */}
        <div className="bg-card border border-gray-300 border-border rounded-xl p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            {companies.length > 0 &&
              <h3 className="text-lg font-semibold text-foreground">
                Suas Empresas
              </h3>
            }

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
            <div>
              <Loading />
            </div>
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
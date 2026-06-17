import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  BarChart3,
  Download,
  UploadCloud,
  Loader2
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { useState } from "react";
import axios from "axios";

interface LinhaDRE {
  mes: string;
  conta: string;
  valor: number;
  operacao: string;
}

interface DREData {
  empresa: string;
  periodo: string;
  linhas_dre: LinhaDRE[];
}

interface FinancialDashboardProps {
  dre: DREData;
}

export default function FinancialDashboard({
}: FinancialDashboardProps) {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const cnpj = useParams().cnpj;

  const location = useLocation();
  const { companyNome, companyCnpj } = location.state;



  const [dre, setDre] = useState<DREData>({
    empresa: "",
    periodo: "",
    linhas_dre: []
  });

  const [arquivo, setArquivo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    }).format(value);
  };

  const carregarDRE = async () => {
    if (!cnpj) {
      setError("CNPJ não informado");
      return;
    }

    if (!arquivo) {
      setError("Selecione um arquivo PDF");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const formData = new FormData();

      formData.append("pdf", arquivo);

      const response = await axios.post(
        `http://localhost:3000/api/google/processar-pdf/${cnpj}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setDre(response.data.resultado.dados);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar DRE");
    } finally {
      setLoading(false);
    }
  };

  const getConta = (nome: string) =>
    dre.linhas_dre.find(
      item =>
        item.conta.trim().toUpperCase() ===
        nome.trim().toUpperCase()
    )?.valor ?? 0;

  const getContaPorTermo = (termoChave: string) => {
    const termoFormatado = termoChave.trim().toUpperCase();

    return dre.linhas_dre.find(item =>
      item.conta.trim().toUpperCase().includes(termoFormatado)
    )?.valor ?? 0;
  };
  const receitaLiquida = getConta("Receita Líquida");

  const custos = getConta("Custos");

  const resultadoBruto = getConta(
    "Resultado Operacional Bruto"
  );

  const tributosLucro = getConta(
    "Tributos sobre o Lucro"
  );

  const lucroLiquido = getContaPorTermo("LÍQUIDO")

  const despesasOperacionais = getConta(
    "Despesas Operacionais"
  );

  const margemLiquida =
    receitaLiquida > 0
      ? (lucroLiquido / receitaLiquida) * 100
      : 0;

  const indicators = [
    {
      title: "Receita Líquida",
      value: formatCurrency(receitaLiquida),
      icon: DollarSign
    },
    {
      title: "Resultado Bruto",
      value: formatCurrency(resultadoBruto),
      icon: TrendingUp
    },
    {
      title: "Lucro Líquido",
      value: formatCurrency(lucroLiquido),
      icon: TrendingUp
    },
    {
      title: "Margem Líquida",
      value: `${margemLiquida.toFixed(2)}%`,
      icon: BarChart3
    }
  ];

  const resumoFinanceiro = [
    {
      categoria: "Receita Líquida",
      valor: receitaLiquida
    },
    {
      categoria: "Custos",
      valor: custos
    },
    {
      categoria: "Despesas",
      valor: despesasOperacionais
    },
    {
      categoria: "Tributos",
      valor: tributosLucro
    },
    {
      categoria: "Lucro Líquido",
      valor: lucroLiquido
    }
  ];

  const expenseBreakdown = [
    {
      name: "Pessoal",
      value: getConta("Despesas com Pessoal"),
      color: "#f54900"
    },
    {
      name: "Ocupação",
      value: getConta("Ocupação"),
      color: "#009689"
    },
    {
      name: "Tributos",
      value: tributosLucro,
      color: "#104e64"
    },
    {
      name: "Custos",
      value: custos,
      color: "#f5b000"
    }
  ].filter(item => item.value > 0);


  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex w-[400px] flex-col items-center rounded-2xl bg-white p-8 shadow-2xl">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-orange-500" />

            <h3 className="text-xl font-semibold">
              Analisando DRE
            </h3>

            <p className="mt-2 text-center text-muted-foreground">
              Extraindo dados financeiros do PDF...
            </p>

            {/* <div className="mt-6 w-full">
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full animate-pulse rounded-full bg-orange-500 w-full" />
              </div>
            </div> */}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background">
        {/* HEADER */}
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-accent rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <h1 className="text-xl font-semibold">
                    Dashboard DRE
                  </h1>

                  <p className="text-sm text-muted-foreground">
                    {companyNome} • {companyCnpj}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    setArquivo(e.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* KPIs */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}
          <div className="mb-8">
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) =>
                setArquivo(e.target.files?.[0] || null)
              }
            />

            <label
              htmlFor="pdf-upload"
              className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 p-8 transition-all hover:border-orange-500 hover:bg-orange-50"
            >
              <UploadCloud className="mb-3 h-10 w-10 text-orange-500 transition-transform group-hover:scale-110" />

              <span className="text-lg font-medium">
                Clique para selecionar sua DRE
              </span>

              <span className="mt-1 text-sm text-muted-foreground">
                PDF • até 10MB
              </span>

              {arquivo && (
                <div className="mt-4 rounded-lg bg-white px-4 py-2 shadow-sm border">
                  <span className="text-sm font-medium text-green-600">
                    ✓ {arquivo.name}
                  </span>
                </div>
              )}
            </label>

            <div className="mt-4 flex justify-end">
              <button
                onClick={carregarDRE}
                disabled={!arquivo || loading}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analisando DRE...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Analisar Dados
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {indicators.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-card border rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>

                  <h3 className="text-sm text-muted-foreground">
                    {item.title}
                  </h3>

                  <p className="text-2xl font-semibold">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-6">
                Resumo Financeiro
              </h3>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={resumoFinanceiro}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="categoria" />

                  <YAxis />

                  <Tooltip formatter={formatCurrency} />

                  <Bar
                    dataKey="valor"
                    fill="#f54900"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIZZA */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-6">
                Distribuição de Despesas
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip formatter={formatCurrency} />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-6">
              Demonstração de Resultado (DRE)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">
                      Conta
                    </th>

                    <th className="text-center py-3 px-4">
                      Operação
                    </th>

                    <th className="text-right py-3 px-4">
                      Valor
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dre.linhas_dre.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-accent/20"
                    >
                      <td className="py-3 px-4">
                        {item.conta}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.operacao}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
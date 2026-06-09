import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  BarChart3,
  Download,
  Share2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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

  const receitaLiquida = getConta("Receita Líquida");

  const custos = getConta("Custos");

  const resultadoBruto = getConta(
    "Resultado Operacional Bruto"
  );

  const tributosLucro = getConta(
    "Tributos sobre o Lucro"
  );

  const lucroLiquido = getConta(
    "Resultado Líquido (Lucro Líquido ou Prejuízo Líquido)"
  );

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
                  {dre.empresa} • {dre.periodo}
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

              <label
                htmlFor="pdf-upload"
                className="px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:opacity-90"
              >
                Selecionar PDF
              </label>

              {arquivo && (
                <span className="text-sm text-muted-foreground max-w-[250px] truncate">
                  {arquivo.name}
                </span>
              )}

              <button
                onClick={carregarDRE}
                disabled={!arquivo || loading}
                className="px-4 py-2 bg-primary text-black rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />

                {loading ? "Processando..." : "Carregar DRE"}
              </button>
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

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* BARRAS */}
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

        {/* TABELA DRE */}
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
  );
}
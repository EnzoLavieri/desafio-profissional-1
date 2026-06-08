import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  BarChart3,
  Download,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    }).format(value);
  };

  const dre = {
   "empresa":"Não informada",
   "periodo":"Março 2023",
   "linhas_dre":[
      {
         "mes":"Março",
         "conta":"Receita Bruta de Vendas",
         "valor":1000000,
         "operacao":"+"
      },
      {
         "mes":"Março",
         "conta":"Receitas de Vendas",
         "valor":1000000,
         "operacao":"+"
      },
      {
         "mes":"Março",
         "conta":"Deduções da Receita Bruta",
         "valor":156500,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Tributos sobre Vendas e Serviços",
         "valor":156500,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Tributos s/ Faturamento",
         "valor":156500,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Receita Líquida",
         "valor":843500,
         "operacao":" ="
      },
      {
         "mes":"Março",
         "conta":"Custos",
         "valor":500000,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Custo das Mercadorias Vendidas",
         "valor":500000,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Resultado Operacional Bruto",
         "valor":343500,
         "operacao":" ="
      },
      {
         "mes":"Março",
         "conta":"Despesas Operacionais",
         "valor":7325.57,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Despesas Administrativas",
         "valor":7325.57,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Despesas com Pessoal",
         "valor":4325.57,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Salário e Ordenados",
         "valor":2000,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Férias",
         "valor":222.22,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"13º Salário",
         "valor":166.67,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"INSS",
         "valor":155.68,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"FGTS",
         "valor":160,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Pró-Labore",
         "valor":1621,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Ocupação",
         "valor":3000,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Aluguel",
         "valor":3000,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Energia Elétrica",
         "valor":350,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Agua e Esgoto",
         "valor":125,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Telefonia e Internet",
         "valor":80,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Resultado antes dos Tributos s/ Lucro",
         "valor":336174.43,
         "operacao":" ="
      },
      {
         "mes":"Março",
         "conta":"Despesa com Tributos sobre o Lucro",
         "valor":80538.61,
         "operacao":" ="
      },
      {
         "mes":"Março",
         "conta":"Tributos sobre o Lucro",
         "valor":80538.61,
         "operacao":"-"
      },
      {
         "mes":"Março",
         "conta":"Resultado Líquido (Lucro Líquido ou Prejuízo Líquido)",
         "valor":255635.82,
         "operacao":" ="
      }
   ]
}


  const getConta = (nome: string) =>
    dre.linhas_dre.find(
      item => item.conta === nome
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

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-secondary rounded-lg flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>

              <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPIs */}
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
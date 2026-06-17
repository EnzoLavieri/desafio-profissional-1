// RelatoriosEmpresa.tsx

import {
    FileText,
    Download,
    Calendar,
    Eye,
    Search,
    ArrowLeft,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Relatorio {
    id: string;
    nome: string;
    tipo: string;
    dataGeracao: string;
    tamanho: string;
    dados: any;
    empresa: any;
}

export default function RelatoriosEmpresa() {
    const location = useLocation();

    const navigate = useNavigate();

    const {empresaId}  = useParams();

    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const companyNome = location.state?.companyNome ?? 'Empresa';
    const companyCnpj = location.state?.companyCnpj ?? '';
    const companyId = location.state?.companyId ?? '';

    console.log('companyId:', companyId);

    // const relatorios: Relatorio[] = [
    //     {
    //         id: '1',
    //         nome: 'DRE Janeiro 2025',
    //         tipo: 'DRE',
    //         dataGeracao: '10/02/2025',
    //         tamanho: '1.2 MB',
    //     },
    //     {
    //         id: '2',
    //         nome: 'Fluxo de Caixa Janeiro 2025',
    //         tipo: 'Fluxo de Caixa',
    //         dataGeracao: '11/02/2025',
    //         tamanho: '850 KB',
    //     },
    //     {
    //         id: '3',
    //         nome: 'Balancete Fevereiro 2025',
    //         tipo: 'Balancete',
    //         dataGeracao: '05/03/2025',
    //         tamanho: '980 KB',
    //     },
    // ];

    console.log(empresaId)

    useEffect(() => {
        async function carregarRelatorios() {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:3000/api/google/buscar-dre/${empresaId}`
                );

                const data = await response.json();

                setRelatorios(data.resultado);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (empresaId) {
            carregarRelatorios();
        }
    }, [empresaId]);

    { console.log(relatorios) }

    return (
        <div >
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-10 bg-white">
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
                                <h1 className="text-xl font-semibold text-foreground">
                                    Relatórios da Empresa
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    Todos os relatórios financeiros gerados para {companyNome}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </header>
            {/* <div>
        <h1 className="text-3xl font-bold">
          Relatórios da Empresa
        </h1>

        <p className="text-muted-foreground mt-2">
          {companyNome}
        </p>

        <p className="text-sm text-gray-500">
          {companyCnpj}
        </p>
      </div> */}

            {/* Busca */}
            {/* <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        
        <input
        type="text"
        placeholder="Buscar relatório..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
        />
        </div> */}

            {/* Lista */}
            <div className="py-6 px-60">
                <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold border-b bg-muted/30 border-gray-300">
                        <div className="col-span-5">Relatório</div>
                        {/* <div className="col-span-2">Tipo</div> */}
                        <div className="col-span-2">Periodo</div>
                        {/* <div className="col-span-1">Tamanho</div> */}
                        <div className="col-span-2 text-right">Ações</div>
                    </div>

                    {relatorios.map((relatorio) => (
                        <div
                            key={relatorio.id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-300 last:border-b-0 items-center hover:bg-accent/30"
                        >
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>

                                <div>
                                    <p className="font-medium">
                                        {relatorio.dados.empresa}
                                    </p>
                                </div>
                            </div>

                            {/* <div className="col-span-2">
                                {relatorio.tipo}
                            </div> */}

                            <div className="col-span-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {relatorio.dados.periodo}
                            </div>

                            {/* <div className="col-span-1">
                                {relatorio.tamanho}
                            </div> */}

                            <div className="col-span-2 flex justify-end gap-2">
                                <button
                                    className="p-2 rounded-lg border hover:bg-accent"
                                    title="Visualizar"
                                    onClick={() =>
                                        navigate("/dashboardfinanceiro", {
                                            state: {
                                                companyNome,
                                                companyCnpj,
                                                companyId,
                                                dre: relatorio.dados, // contém linhas_dre
                                            },
                                        })
                                    }                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                                {/* <button
                                    className="p-2 rounded-lg border hover:bg-accent"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </button> */}
                            </div>
                        </div>
                    ))}

                    {relatorios.length === 0 && (
                        <div className="p-12 text-center">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />

                            <h3 className="font-semibold">
                                Nenhum relatório encontrado
                            </h3>

                            <p className="text-muted-foreground mt-2">
                                Esta empresa ainda não possui relatórios gerados.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
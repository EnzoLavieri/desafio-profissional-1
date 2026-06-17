// ImportDre.tsx

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    Upload,
    FileText,
    AlertCircle,
    CheckCircle,
    X,
    Loader2,
} from "lucide-react";

interface ArquivoUpload {
    file: File;
    status: "ready" | "uploading" | "success" | "error";
    progress: number;
}

export default function ImportDre() {
    const navigate = useNavigate();
    const { cnpj } = useParams();

    console.log(cnpj)

    const token = localStorage.getItem("token");

    const [files, setFiles] = useState<ArquivoUpload[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatFileSize = (bytes: number) => {
        if (!bytes) return "0 Bytes";

        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
            " " +
            sizes[i]
        );
    };

    const addFiles = (selectedFiles: FileList | File[]) => {
        const novosArquivos = Array.from(selectedFiles)
            .filter((file) => file.type === "application/pdf")
            .map((file) => ({
                file,
                status: "ready" as const,
                progress: 0,
            }));

        setFiles((prev) => [...prev, ...novosArquivos]);
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);

        if (e.dataTransfer.files?.length) {
            addFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files?.length) {
            addFiles(e.target.files);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (!cnpj) {
            setError("CNPJ não informado");
            return;
        }

        if (files.length === 0) {
            setError("Selecione ao menos um PDF");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            for (let i = 0; i < files.length; i++) {
                const arquivoAtual = files[i];

                const formData = new FormData();

                formData.append("pdf", arquivoAtual.file);

                setFiles((prev) =>
                    prev.map((item, index) =>
                        index === i
                            ? { ...item, status: "uploading" }
                            : item
                    )
                );

                const response = await axios.post(
                    `http://localhost:3000/api/google/processar-pdf/${cnpj}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) /
                                (progressEvent.total || 1)
                            );

                            setFiles((prev) =>
                                prev.map((item, index) =>
                                    index === i
                                        ? { ...item, progress }
                                        : item
                                )
                            );
                        },
                    }
                );

                setFiles((prev) =>
                    prev.map((item, index) =>
                        index === i
                            ? {
                                ...item,
                                status: "success",
                                progress: 100,
                            }
                            : item
                    )
                );

                navigate(`/relatorios/${cnpj}`,);
                //navigate(`/dashboardfinanceiro/${cnpj}`, {
                //   state: {
                //     dre: response.data.resultado.dados,
                //   },
                //});

                return;
            }
        } catch (err) {
            console.error(err);

            setError("Erro ao processar DRE");

            setFiles((prev) =>
                prev.map((item) => ({
                    ...item,
                    status: "error",
                }))
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center rounded-2xl bg-card p-8 shadow-2xl">
                        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />

                        <h3 className="text-xl font-semibold">
                            Analisando DRE
                        </h3>

                        <p className="mt-2 text-center text-muted-foreground">
                            Extraindo dados financeiros do PDF...
                        </p>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-background">
                <header className="bg-card border-b border-border">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-accent rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>

                            <div>
                                <h1 className="text-xl font-semibold">
                                    Enviar DRE
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    {cnpj
                                        ? `CNPJ: ${cnpj}`
                                        : "Selecione os arquivos para processar"}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-8">
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            Instruções para upload
                        </h3>

                        <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                            <li>• Apenas arquivos PDF</li>
                            <li>• Tamanho máximo recomendado: 10MB</li>
                            <li>• PDF deve estar legível</li>
                            <li>• Arraste ou selecione arquivos</li>
                        </ul>
                    </div>

                    <div
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-primary/50 hover:bg-accent/30"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Upload className="w-10 h-10 text-primary" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Arraste seus PDFs aqui
                                </h3>

                                <p className="text-muted-foreground mb-4">
                                    ou clique para selecionar
                                </p>

                                <label className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90">
                                    Selecionar Arquivos

                                    <input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        multiple
                                        className="hidden"
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-8 bg-card border border-border rounded-xl p-6">
                            <h3 className="font-semibold mb-4">
                                Arquivos Selecionados ({files.length})
                            </h3>

                            <div className="space-y-3">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg"
                                    >
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="font-medium truncate">
                                                {file.file.name}
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {formatFileSize(file.file.size)}
                                            </p>

                                            {file.status === "uploading" && (
                                                <div className="mt-2 w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${file.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {file.status === "success" && (
                                            <CheckCircle className="text-green-500 w-5 h-5" />
                                        )}

                                        {file.status === "error" && (
                                            <AlertCircle className="text-red-500 w-5 h-5" />
                                        )}

                                        {file.status === "ready" && (
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="p-1 hover:bg-red-100 rounded"
                                            >
                                                <X className="w-5 h-5 text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setFiles([])}
                                    className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg"
                                >
                                    Limpar Tudo
                                </button>

                                <button
                                    onClick={handleUpload}
                                    disabled={
                                        files.length === 0 || loading
                                    }
                                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                    Processar DRE
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
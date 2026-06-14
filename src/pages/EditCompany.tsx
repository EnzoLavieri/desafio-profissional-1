import axios from 'axios';
import {
  ArrowLeft,
  Plus,
  Building2,
  Edit,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface CNPJManagementProps {
  onNavigate: (screen: string) => void;
}

interface Company {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  endereco: string;
  telefone: string;
}

export default function EditCompany({
  onNavigate
}: CNPJManagementProps) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await axios.get(
        `http://localhost:3000/api/usuarios/listar-cnpjs/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const empresas =
        response.data?.flatMap((usuario: any) =>
          (usuario.empresas || []).map((empresa: any) => ({
            id: empresa.id,
            nome: empresa.nome,
            email: empresa.email,
            cnpj: empresa.cnpj,
            endereco: empresa.endereco,
            telefone: empresa.telefone
          }))
        ) || [];

      setCompanies(empresas);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:3000/api/usuarios/adicionar-cnpj/043c3b83-e9ad-4480-b8ad-e819f409e919',
        {
          nome: formData.nome,
          cnpj: formData.cnpj.replace(/\D/g, ''),
          email: formData.email,
          telefone: formData.telefone,
          endereco: formData.endereco
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await carregarEmpresas();

      setFormData({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: ''
      });

      setShowForm(false);
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      alert('Erro ao cadastrar empresa');
    } finally {
      setSaving(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');

    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>

              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Gerenciar Empresas
                </h1>

                <p className="text-sm text-muted-foreground">
                  Cadastre e gerencie suas empresas
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Empresa
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-6">
              Cadastrar Nova Empresa
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Nome da Empresa *
                  </label>

                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nome: e.target.value
                      })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    CNPJ *
                  </label>

                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cnpj: formatCNPJ(e.target.value)
                      })
                    }
                    required
                    placeholder="00.000.000/0000-00"
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Telefone
                  </label>

                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefone: e.target.value
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-muted-foreground mb-2">
                    Endereço
                  </label>

                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endereco: e.target.value
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg"
                >
                  {saving
                    ? 'Cadastrando...'
                    : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-6">
            Empresas Cadastradas
          </h3>

          {loading && (
            <div className="text-center py-8">
              Carregando empresas...
            </div>
          )}

          {!loading && companies.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma empresa cadastrada.
            </div>
          )}

          <div className="space-y-4">
            {!loading &&
              companies.map((company) => (
                <div
                  key={company.id}
                  className="p-5 bg-accent/30 border border-border/50 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">
                          {company.nome}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          <p>
                            <strong>CNPJ:</strong>{' '}
                            {company.cnpj}
                          </p>

                          <p>
                            <strong>E-mail:</strong>{' '}
                            {company.email}
                          </p>

                          <p>
                            <strong>Telefone:</strong>{' '}
                            {company.telefone}
                          </p>

                          <p>
                            <strong>Endereço:</strong>{' '}
                            {company.endereco}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>

                      <button className="p-2 hover:bg-destructive/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div> */}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
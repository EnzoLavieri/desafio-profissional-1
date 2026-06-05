import axios from 'axios';
import { Building2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      console.log(data)

      // JWT padrão do NestJS
      if (data.access_token) {
        localStorage.setItem(
          "token",
          data.access_token
        );
      }

      navigate("/home");

      // Caso sua API retorne usuário
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "E-mail ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] px-8 py-9 border border-[#ececec]">
          <div className="flex flex-col items-center text-center mb-9">
            <div className="w-[72px] h-[72px] rounded-[20px] bg-[#02021b] flex items-center justify-center mb-5">
              <Building2 className="w-9 h-9 text-white stroke-[1.8]" />
            </div>

            <h1 className="text-[40px] leading-none font-semibold text-[#02021b] tracking-[-1px] mb-3">
              FinanceView
            </h1>

            <p className="text-[18px] text-[#8b8ba3] font-normal">
              Sistema de Análise Financeira DRE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-[16px] font-medium text-[#02021b] mb-3"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8d8da3]" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full h-[56px] rounded-[12px] border border-[#d8d8df] bg-[#f5f5f7] pl-12 pr-4"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[16px] font-medium text-[#02021b] mb-3"
              >
                Senha
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8d8da3]" />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[56px] rounded-[12px] border border-[#d8d8df] bg-[#f5f5f7] pl-12 pr-4"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-[56px]
                rounded-[14px]
                bg-[#02021b]
                text-white
                text-[18px]
                font-semibold
                shadow-[0_6px_18px_rgba(0,0,0,0.18)]
                transition-all
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-[15px] text-[#8b8ba3] mt-8">
          Processamento seguro de demonstrações financeiras
        </p>
      </div>
    </div>
  );
}
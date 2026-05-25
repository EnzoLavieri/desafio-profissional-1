import { Building2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function App({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] px-8 py-9 border border-[#ececec]">
          {/* Header */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
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
                  className="
                    w-full
                    h-[56px]
                    rounded-[12px]
                    border
                    border-[#d8d8df]
                    bg-[#f5f5f7]
                    pl-12
                    pr-4
                    text-[16px]
                    text-[#02021b]
                    placeholder:text-[#9b9bb0]
                    outline-none
                    transition-all
                    focus:border-[#02021b]
                    focus:ring-4
                    focus:ring-[#02021b]/10
                  "
                  required
                />
              </div>
            </div>

            {/* Password */}
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
                  className="
                    w-full
                    h-[56px]
                    rounded-[12px]
                    border
                    border-[#d8d8df]
                    bg-[#f5f5f7]
                    pl-12
                    pr-4
                    text-[16px]
                    text-[#02021b]
                    placeholder:text-[#9b9bb0]
                    outline-none
                    transition-all
                    focus:border-[#02021b]
                    focus:ring-4
                    focus:ring-[#02021b]/10
                  "
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="
                    w-4
                    h-4
                    rounded
                    border-[#cfcfd8]
                    text-[#02021b]
                    focus:ring-[#02021b]/20
                  "
                />

                <span className="text-[15px] text-[#8b8ba3]">
                  Lembrar-me
                </span>
              </label>

              <button
                type="button"
                className="text-[15px] font-medium text-[#02021b] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
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
                hover:opacity-95
                active:scale-[0.99]
              "
            >
              Entrar
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-[#ececf2] text-center">
            <p className="text-[15px] text-[#8b8ba3]">
              Não tem uma conta?{' '}
              <button
                type="button"
                className="font-semibold text-[#02021b] hover:underline"
              >
                Solicitar acesso
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-[15px] text-[#8b8ba3] mt-8">
          Processamento seguro de demonstrações financeiras
        </p>
      </div>
    </div>
  );
}
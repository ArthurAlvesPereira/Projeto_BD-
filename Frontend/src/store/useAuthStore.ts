import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Aluno {
  matricula: number;
  nome: string;
  codigoCurso_FK: string;
}

interface Atletica {
  cnpj: string;
  nome: string;
  sigla: string;
  mascote: string;
}

type UserType = "aluno" | "atletica" | null;

interface AuthState {
  userType: UserType;
  aluno: Aluno | null;
  atletica: Atletica | null;

  loginAluno: (aluno: Aluno) => void;
  loginAtletica: (atletica: Atletica) => void;
  logout: () => void;

  isAuthenticated: () => boolean;
  isAluno: () => boolean;
  isAtletica: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userType: null,
      aluno: null,
      atletica: null,

      loginAluno: (aluno) => set({ userType: "aluno", aluno, atletica: null }),

      loginAtletica: (atletica) =>
        set({ userType: "atletica", atletica, aluno: null }),

      logout: () => set({ userType: null, aluno: null, atletica: null }),

      isAuthenticated: () => get().userType !== null,

      isAluno: () => get().userType === "aluno",

      isAtletica: () => get().userType === "atletica",
    }),
    {
      name: "auth-storage",
    }
  )
);

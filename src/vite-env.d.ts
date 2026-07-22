/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL base del API publicado. Se define en `.env.local` (ver `.env.example`).
   *
   * Opcional a nivel de tipos porque puede faltar en tiempo de ejecución;
   * `src/core/config/env.ts` la valida y expone ya normalizada.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

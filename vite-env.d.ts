/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_URL: string;
  // Add other VITE_* variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

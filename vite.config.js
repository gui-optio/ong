import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Porta fixa para bater com o túnel do ngrok (ngrok http 3000)
    port: 3000,
    strictPort: true,
    // Escuta em IPv4 e IPv6 para o ngrok e o celular na mesma rede alcançarem
    host: true,
    // Vite bloqueia hosts desconhecidos; libera os domínios do ngrok
    allowedHosts: [".ngrok-free.dev", ".ngrok-free.app"],
  },
});

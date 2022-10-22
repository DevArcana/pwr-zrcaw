import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidStyled from 'vite-plugin-solid-styled';

export default defineConfig({
  plugins: [
    solidPlugin(),
    solidStyled({
      filter: {
        include: 'src/**/*.{ts,tsx}',
        exclude: 'node_modules/**/*.{ts,tsx,js,jsx}',
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});

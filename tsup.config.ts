import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['mod.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  clean: true,
});
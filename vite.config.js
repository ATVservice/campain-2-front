import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ag-grid-community/react': '@ag-grid-community/react',
      '@ag-grid-community/core': '@ag-grid-community/core',
      '@ag-grid-enterprise/range-selection': '@ag-grid-enterprise/range-selection',
      '@ag-grid-enterprise/core': '@ag-grid-enterprise/core',
    }
  }
});

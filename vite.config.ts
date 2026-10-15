import { realpathSync } from 'node:fs'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      // Keep math fonts available when dependencies are installed through a symlink.
      allow: [searchForWorkspaceRoot(process.cwd()), realpathSync(new URL('./node_modules', import.meta.url))],
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { generateGalleryManifest } from './scripts/createGalleryManifest.js'

const galleryRootPattern = /[\\/]public[\\/]images[\\/](detailLocation|detailTheme)[\\/]/
const configDirectory = path.dirname(fileURLToPath(import.meta.url))

const galleryManifestPlugin = () => {
  let updateTimer
  let updateRunning = false
  let updateQueued = false

  const update = async (server) => {
    if (updateRunning) {
      updateQueued = true
      return
    }
    updateRunning = true
    try {
      await generateGalleryManifest()
      server?.ws.send({ type: 'full-reload' })
    } finally {
      updateRunning = false
      if (updateQueued) {
        updateQueued = false
        await update(server)
      }
    }
  }

  return {
    name: 'kortrip-gallery-manifest',
    async buildStart() {
      await generateGalleryManifest()
    },
    configureServer(server) {
      const imageRoots = [
        path.resolve(configDirectory, 'public/images/detailLocation'),
        path.resolve(configDirectory, 'public/images/detailTheme'),
      ]
      server.watcher.add(imageRoots)
      server.watcher.on('all', (_event, file) => {
        if (!galleryRootPattern.test(file)) return
        clearTimeout(updateTimer)
        updateTimer = setTimeout(() => update(server), 120)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), galleryManifestPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(configDirectory, './src'),
    },
  },
})

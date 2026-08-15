import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientRoot = path.resolve(scriptDirectory, '..')
const detailLocationRoot = path.join(clientRoot, 'public', 'images', 'detailLocation')
const manifestPath = path.join(clientRoot, 'src', 'shared', 'data', 'gallery-manifest.json')
const supportedExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])
const manifest = {}

const locationDirectories = await readdir(detailLocationRoot, {withFileTypes: true})

for (const locationDirectory of locationDirectories) {
    if (!locationDirectory.isDirectory()) continue

    const galleryDirectory = path.join(detailLocationRoot, locationDirectory.name, 'gallery')
    let galleryEntries

    try {
        galleryEntries = await readdir(galleryDirectory, {withFileTypes: true})
    } catch (error) {
        if (error.code === 'ENOENT') continue
        throw error
    }

    const galleryImages = galleryEntries
        .filter((entry) => (
            entry.isFile()
            && supportedExtensions.has(path.extname(entry.name).toLowerCase())
        ))
        .map((entry) => entry.name)
        .sort((firstName, secondName) => firstName.localeCompare(
            secondName,
            undefined,
            {numeric: true, sensitivity: 'base'},
        ))
        .map((fileName) => (
            `/images/detailLocation/${locationDirectory.name}/gallery/${fileName}`
        ))

    if (galleryImages.length === 0) continue

    manifest[`/images/detailLocation/${locationDirectory.name}/gallery/`] = galleryImages
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

const imageCount = Object.values(manifest).reduce(
    (total, images) => total + images.length,
    0,
)

console.log(`Gallery manifest: ${Object.keys(manifest).length} galleries, ${imageCount} images`)

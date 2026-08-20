import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientRoot = path.resolve(scriptDirectory, '..')
const detailLocationRoot = path.join(clientRoot, 'public', 'images', 'detailLocation')
const detailThemeRoot = path.join(clientRoot, 'public', 'images', 'detailTheme')
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

// Theme detail images are stored directly in each place directory instead of
// a nested gallery directory. Expose them under the same virtual `gallery/`
// key that DetailGallery derives from the place's main image URL.
const themeDirectories = await readdir(detailThemeRoot, {withFileTypes: true})

for (const themeDirectory of themeDirectories) {
    if (!themeDirectory.isDirectory()) continue

    const themeEntries = await readdir(
        path.join(detailThemeRoot, themeDirectory.name),
        {withFileTypes: true},
    )
    const escapedDirectoryName = themeDirectory.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const galleryFilePattern = new RegExp(`^${escapedDirectoryName}(\\d+)\\.[^.]+$`, 'i')

    const galleryImages = themeEntries
        .filter((entry) => {
            if (!entry.isFile()) return false
            if (!supportedExtensions.has(path.extname(entry.name).toLowerCase())) return false

            const match = entry.name.match(galleryFilePattern)
            return match && Number(match[1]) >= 5
        })
        .map((entry) => entry.name)
        .sort((firstName, secondName) => firstName.localeCompare(
            secondName,
            undefined,
            {numeric: true, sensitivity: 'base'},
        ))
        .map((fileName) => (
            `/images/detailTheme/${themeDirectory.name}/${fileName}`
        ))

    if (galleryImages.length === 0) continue

    manifest[`/images/detailTheme/${themeDirectory.name}/gallery/`] = galleryImages
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

const imageCount = Object.values(manifest).reduce(
    (total, images) => total + images.length,
    0,
)

console.log(`Gallery manifest: ${Object.keys(manifest).length} galleries, ${imageCount} images`)

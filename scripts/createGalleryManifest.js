import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientRoot = path.resolve(scriptDirectory, '..')
const detailLocationRoot = path.join(clientRoot, 'public', 'images', 'detailLocation')
const detailThemeRoot = path.join(clientRoot, 'public', 'images', 'detailTheme')
const manifestPath = path.join(clientRoot, 'src', 'shared', 'data', 'gallery-manifest.json')
const supportedExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])

export async function generateGalleryManifest() {
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

// Theme galleries use the same gallery-folder convention as location pages.
// Legacy numbered images in the place root remain supported until each place
// is migrated to its own gallery folder.
const themeDirectories = await readdir(detailThemeRoot, {withFileTypes: true})

for (const themeDirectory of themeDirectories) {
    if (!themeDirectory.isDirectory()) continue

    const placeDirectory = path.join(detailThemeRoot, themeDirectory.name)
    const galleryDirectory = path.join(placeDirectory, 'gallery')
    let galleryEntries
    let usesGalleryDirectory = true

    try {
        galleryEntries = await readdir(galleryDirectory, {withFileTypes: true})
    } catch (error) {
        if (error.code !== 'ENOENT') throw error
        usesGalleryDirectory = false
        galleryEntries = await readdir(placeDirectory, {withFileTypes: true})
    }

    const escapedDirectoryName = themeDirectory.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const legacyGalleryFilePattern = new RegExp(`^${escapedDirectoryName}(\\d+)\\.[^.]+$`, 'i')
    const galleryImages = galleryEntries
        .filter((entry) => (
            entry.isFile()
            && supportedExtensions.has(path.extname(entry.name).toLowerCase())
            && (
                usesGalleryDirectory
                || Number(entry.name.match(legacyGalleryFilePattern)?.[1]) >= 5
            )
        ))
        .map((entry) => entry.name)
        .sort((firstName, secondName) => firstName.localeCompare(
            secondName,
            undefined,
            {numeric: true, sensitivity: 'base'},
        ))
        .map((fileName) => (
            `/images/detailTheme/${themeDirectory.name}/${usesGalleryDirectory ? 'gallery/' : ''}${fileName}`
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
}

const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : ''
if (executedFile === fileURLToPath(import.meta.url)) {
    await generateGalleryManifest()
}

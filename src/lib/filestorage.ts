import fs from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
export async function initializeFileStorage() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function saveFile(file: Buffer, fileName: string): Promise<string> {
  const uniqueFileName = `${Date.now()}-${fileName}`
  const filePath = path.join(UPLOAD_DIR, uniqueFileName)
  await fs.writeFile(filePath, file)
  return `/uploads/${uniqueFileName}` // Returns public URL path
}

export async function deleteFile(fileUrl: string) {
  const fileName = fileUrl.split('/').pop()
  if (!fileName) return
  const filePath = path.join(UPLOAD_DIR, fileName)
  try {
    await fs.unlink(filePath)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

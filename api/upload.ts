import { put } from '@vercel/blob'
import { IncomingForm } from 'formidable'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync, unlinkSync } from 'fs'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_WIDTH = 1600
const MAX_FILE_SIZE = 4.5 * 1024 * 1024 // 4.5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = new IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      multiples: false,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { files } = await new Promise<{ files: { file?: any[] } }>((resolve, reject) => {
      form.parse(req, (err, _, files) => {
        if (err) {
          if (err.message.includes('maxFileSize exceeded')) {
            return reject(new Error('File size exceeds limit'))
          }
          return reject(err)
        }
        resolve({ files })
      })
    })

    // Validate file exists
    if (!files?.file?.[0]) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const uploadedFile = files.file[0]

    // Validate file type
    if (!uploadedFile.mimetype || !ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type',
        allowedTypes: ALLOWED_MIME_TYPES,
      })
    }

    // Read file and validate size again (double check)
    const fileBuffer = readFileSync(uploadedFile.filepath)
    if (fileBuffer.byteLength > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds limit' })
    }

    // Process image
    let finalBuffer = fileBuffer
    let dimensions = { width: 0, height: 0 }

    try {
      const image = sharp(fileBuffer)
      const metadata = await image.metadata()

      dimensions = {
        width: metadata.width || 0,
        height: metadata.height || 0,
      }

      if (dimensions.width > MAX_FILE_WIDTH) {
        dimensions = {
          width: MAX_FILE_WIDTH,
          height: Math.round((MAX_FILE_WIDTH / dimensions.width) * dimensions.height),
        }

        finalBuffer = await image.resize(MAX_FILE_WIDTH).toBuffer()
      }
    } catch (error) {
      console.error('Image processing error:', error)
      return res.status(400).json({ error: 'Invalid image file' })
    }

    // Generate filename
    const originalName = uploadedFile.originalFilename || 'uploaded_image'
    const lastDotIndex = originalName.lastIndexOf('.')
    const fileExtension = lastDotIndex === -1 ? '' : originalName.substring(lastDotIndex)
    const newFilename = `${Date.now()}-${uuidv4()}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(newFilename, finalBuffer, {
      access: 'public',
      contentType: uploadedFile.mimetype,
    })

    // Clean up temp file
    unlinkSync(uploadedFile.filepath)

    return res.status(200).json({
      success: true,
      url: blob.url,
      width: dimensions.width,
      height: dimensions.height,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Upload error:', errorMessage)
    return res.status(500).json({
      success: false,
      error: 'Upload failed',
      details: errorMessage.includes('maxFileSize') ? 'File exceeds limit' : errorMessage,
    })
  }
}

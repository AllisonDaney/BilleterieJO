import { ofetch } from 'ofetch'
import { createHash } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const { file, folder, publicId } = await readBody(event)

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${config.private.NUXT_CLOUDINARY_CLOUD_NAME}/image/upload`

  const timestamp = Math.floor(Date.now() / 1000)

  const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${config.private.NUXT_CLOUDINARY_API_SECRET}`
  const signature = createHash('sha1').update(signatureString).digest('hex')

  const formData = new URLSearchParams()
  formData.append('file', file)
  formData.append('api_key', config.private.NUXT_CLOUDINARY_API_KEY)
  formData.append('timestamp', timestamp.toString())
  formData.append('folder', folder)
  formData.append('public_id', publicId)
  formData.append('signature', signature)

  const result = await ofetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return { url: result.secure_url }
})

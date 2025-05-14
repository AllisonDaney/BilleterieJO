import type { RuntimeConfig } from 'nuxt/schema'
import { v2 as cloudinary } from 'cloudinary'

export function useCloudinary(config: RuntimeConfig) {
  cloudinary.config({
    cloud_name: config.private.NUXT_CLOUDINARY_CLOUD_NAME,
    api_key: config.private.NUXT_CLOUDINARY_API_KEY,
    api_secret: config.private.NUXT_CLOUDINARY_API_SECRET,
  })

  async function uploadFile({ folder, file, publicId }: { folder: string, file: string, publicId: string }) {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      public_id: publicId,
      overwrite: true,
    })

    return result.secure_url
  }

  return {
    uploadFile,
  }
}

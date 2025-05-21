export function useCloudinary() {
  async function uploadFile({ folder, file, publicId }: { folder: string, file: string, publicId: string }) {
    const { url } = await $fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: { file, folder, publicId },
    })

    return url
  }

  return {
    uploadFile,
  }
}

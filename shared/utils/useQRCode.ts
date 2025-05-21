import QRCode from 'qr-image'

export function useQRCode() {
  async function generateQRCodeWithUrl(url: string) {
    const buffer = QRCode.imageSync(url, { type: 'png', size: 3, margin: 1 })
    const base64 = buffer.toString('base64')

    return `data:image/png;base64,${base64}`
  }

  return {
    generateQRCodeWithUrl,
  }
}

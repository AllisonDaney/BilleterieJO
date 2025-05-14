import QRCode from 'qrcode'

export function useQRCode() {
  async function generateQRCodeWithUrl(url: string) {
    return await QRCode.toDataURL(url)
  }

  return {
    generateQRCodeWithUrl,
  }
}

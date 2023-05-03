import { injectable } from 'tsyringe'

@injectable()
export class Base64Converter {
  async toFile(base64: string, filename: ''): Promise<File> {
    const base64Response = await fetch(base64)
    const blob = await base64Response.blob()

    return new File([blob], filename)
  }

  toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = (reader.result as string).split('base64,')[1]
          resolve(base64)
        }

        reader.readAsDataURL(file!)
      } catch (error) {
        reject(error)
      }
    })
  }
}

declare module 'browser-image-compression' {
  interface ImageCompressionOptions {
    maxSizeMB: number
    maxWidthOrHeight: number
    useWebWorker?: boolean
    maxIteration?: number
    fileType?: string
  }
  function getDataUrlFromFile(file: File): Promise<string>

  function imageCompression(file: File, options: ImageCompressionOptions): Promise<File>

  // @ts-ignore
  imageCompression.getDataUrlFromFile = getDataUrlFromFile

  export = imageCompression
}

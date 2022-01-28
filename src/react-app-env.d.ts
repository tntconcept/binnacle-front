declare module 'fuzzysearch'
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

declare module 'react-ios-pwa-prompt' {
  interface Props {
    timesToShow?: number
    delay?: number
    permanentlyHideOnDismiss?: boolean
    copyTitle?: string
    copyBody?: string
    copyClosePrompt?: string
    copyShareButtonLabel?: string
    copyAddHomeButtonLabel?: string
    promptOnVisit?: number
    debug?: boolean
  }

  export default function PWAPrompt(props: Props): JSX.Element
}

interface Window {
  Cypress: string
  electron: {
    getStoreValue: (key: string) => any
    setStoreValue: (key: string, value: any) => void
    deleteStoreValue: (key: string) => void
  }
}

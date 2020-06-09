/// <reference types="react-scripts" />
declare module "fuzzysearch";
declare module "browser-image-compression" {
  interface ImageCompressionOptions {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    useWebWorker?: boolean;
    maxIteration?: number;
    fileType?: string
  }
  function getDataUrlFromFile(file: File): Promise<string>;

  function imageCompression(file: File, options: ImageCompressionOptions): Promise<File>;

  imageCompression.getDataUrlFromFile = getDataUrlFromFile;

  export = imageCompression;
}

declare module "fetch-mock/es5/client" {
  import * as fetchMock from "fetch-mock"
  export = fetchMock;
}

declare module "react-ios-pwa-prompt" {
  interface Props {
    timesToShow?: number;
    delay?: number;
    permanentlyHideOnDismiss?: boolean;
    copyTitle?: string;
    copyBody?: string;
    copyClosePrompt?: string;
    copyShareButtonLabel?: string;
    copyAddHomeButtonLabel?: string;
    promptOnVisit?: number;
    debug?: boolean;
  }

  export default function PWAPrompt(props: Props): JSX.Element;
}

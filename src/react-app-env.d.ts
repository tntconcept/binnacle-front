/// <reference types="react-scripts" />
declare module "fuzzysearch";
declare module "browser-image-compression" {
  interface Options {
    maxSizeMB: number,
    maxWidthOrHeight: number,
    useWebWorker?: boolean,
    maxIteration?: number
  }
  function getDataUrlFromFile(file: File): Promise<string>

  function imageCompression(file: File, options: Options): Promise<File>

  imageCompression.getDataUrlFromFile = getDataUrlFromFile

  export = imageCompression
}
declare module 'refresh-fetch' {
  interface Configuration {
      refreshToken: () => any,
      shouldRefreshToken: (error: any) => boolean,
      fetch: (url: any, options: Object) => Promise<any>
  }
  export function configureRefreshFetch(configuration: Configuration)

  interface TypedResponse<T = any> extends Response {
    /**
     * this will override `json` method from `Body` that is extended by `Response`
     * interface Body {
     *     json(): Promise<any>;
     * }
     */
    body: T
  }

  export function fetchJSON<T>(url: string | Request | URL, options: Object = {}): Promise<TypedResponse<T>>
}

declare module "fetch-mock/es5/client" {
  import * as fetchMock from 'fetch-mock'
  export = fetchMock;
}

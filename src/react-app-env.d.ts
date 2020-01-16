/// <reference types="react-scripts" />
declare module "axios-auth-refresh";
declare module "react-animation";
declare module "css-to-object";
declare module 'refresh-fetch' {
  interface Configuration {
      refreshToken: () => Promise<void>,
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
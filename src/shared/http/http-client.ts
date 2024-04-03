import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { singleton } from 'tsyringe'
import { BASE_URL } from '../api/url'
import { getParamsSerializer } from './get-params-serializer'

type DataType = Record<string, unknown>

interface QueryParams {
  [key: string]: string | number | boolean | undefined
}

@singleton()
export class HttpClient {
  readonly httpInstance: AxiosInstance

  constructor() {
    this.httpInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 20_000,
      withCredentials: true,
      paramsSerializer: getParamsSerializer
    })

    this.httpInstance.interceptors.request.use((config) => {
      if (config.params) {
        config.params = this.removeUndefinedQueryParams(config)
      }
      return config
    })
  }

  private removeUndefinedQueryParams(config: InternalAxiosRequestConfig<unknown>) {
    return Object.keys(config.params)
      .filter((key) => config.params[key] !== undefined)
      .reduce((result: QueryParams, key: string) => {
        result[key] = config.params[key]
        return result
      }, {})
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.httpInstance.get<T>(path, config)
    return data
  }

  async post<T>(path: string, data?: DataType, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpInstance.post<T>(path, data, config)
    return response.data
  }

  async put<T>(path: string, data?: DataType, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpInstance.put<T>(path, data, config)
    return response.data
  }

  async delete<T>(path: string, data?: DataType): Promise<T> {
    const response = await this.httpInstance.delete<T>(path, data)
    return response.data
  }
}

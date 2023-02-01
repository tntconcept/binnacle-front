import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { singleton } from 'tsyringe'

@singleton()
export class HttpClient {
  readonly httpInstance: AxiosInstance

  constructor() {
    this.httpInstance = axios.create({
      timeout: 10_000,
      withCredentials: true
    })
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.httpInstance.get<T>(path, config)
    return data
  }

  async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpInstance.post<T>(path, data, config)
    return response.data
  }

  async put<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpInstance.put<T>(path, data, config)
    return response.data
  }

  async delete<T>(path: string, data?: any): Promise<T> {
    const response = await this.httpInstance.delete<T>(path, data)
    return response.data
  }
}

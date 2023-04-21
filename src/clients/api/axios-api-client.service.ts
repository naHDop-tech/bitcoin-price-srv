import { Injectable } from '@nestjs/common';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { IApiClient } from '@root/clients/api/api-client.interface';

@Injectable()
export class AxiosApiClientService implements IApiClient {
  private readonly client: AxiosInstance;

  protected createAxiosClient(baseURL: string): AxiosInstance {
    const instance = Axios.create({
      baseURL,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10 * 1000,
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        return this.handleError(error);
      },
    );

    return instance;
  }

  constructor(baseURL: string) {
    this.client = this.createAxiosClient(baseURL);
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.post<T, R>(url, data, config);
  }

  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.patch<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.client.delete<T, R>(url, config);
  }

  private handleError(error: any) {
    return Promise.reject(error.message);
  }
}

import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import FormData from "form-data";

// import { useGlobalStore } from "~/stores/useGlobalStore";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface RetryConfig extends AxiosRequestConfig {
  retryCount?: number;
  maxRetries?: number;
  retryDelay?: number;
  _retry?: boolean;
}

class HttpClient {
  private axiosInstance: AxiosInstance;

  // private globalStore = useGlobalStore();
  private refresh_token_url = "/auth/refresh-token";

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "http://127.0.0.1:8888",
      timeout: 10000,
      headers: new AxiosHeaders(),
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // if (useGlobalStore.getState().access_token) {
        //   const headers =
        //     config.headers instanceof AxiosHeaders
        //       ? config.headers
        //       : new AxiosHeaders(config.headers ?? {});

        //   headers.set(
        //     "Authorization",
        //     `Bearer ${useGlobalStore.getState().access_token}`
        //   );
        //   config.headers = headers;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as RetryConfig;

        // if (error.response?.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true;
        //   try {
        //     const newToken = await this.refreshAccessToken();
        //     useGlobalStore.getState().setAccessToken(newToken.access_token);
        //     const headers = new AxiosHeaders();
        //     if (originalRequest.headers) {
        //       Object.entries(originalRequest.headers).forEach(
        //         ([key, value]) => {
        //           headers.set(key, value);
        //         }
        //       );
        //     }
        //     headers.set(
        //       "Authorization",
        //       `Bearer ${useGlobalStore.getState().access_token}`
        //     );
        //     originalRequest.headers = headers;
        //     return this.axiosInstance(originalRequest);
        //   } catch (refreshError) {
        //     console.error("Token refresh failed:", refreshError);
        //     useGlobalStore.getState().setAccessToken(undefined);
        //     useGlobalStore.getState().setRefreshToken(undefined);
        //     return Promise.reject(refreshError);
        //   }
        // }
        // 指数退避算法。 如果使用了 swr 之类的框架则不用
        if (this.shouldRetry(error, originalRequest)) {
          if (originalRequest) {
            originalRequest.retryCount = (originalRequest?.retryCount || 0) + 1;
            const delay = this.getRetryDelay(originalRequest.retryCount);

            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.axiosInstance(originalRequest);
          }
        }

        return Promise.reject(error.response.data.detail);
      }
    );
  }

  private shouldRetry(
    error: Error & { response?: { status: number } },
    config: RetryConfig
  ): boolean {
    const maxRetries = config?.maxRetries || 3;
    const retryCount = config?.retryCount || 0;
    const status = error.response?.status;
    // console.log(`status: ${status}. config.retryCount: ${config?.retryCount}`);
    return (
      retryCount < maxRetries &&
      status !== 401 &&
      status !== 404 &&
      status !== 400
    );
  }

  private getRetryDelay(retryCount: number): number {
    const baseDelay = 1000;
    return Math.min(baseDelay * Math.pow(2, retryCount), 10000);
  }

  // private async refreshAccessToken(): Promise<TokenResponse> {
  //   const response = await this.axiosInstance.put<TokenResponse>(
  //     this.refresh_token_url,
  //     {
  //       refresh_token: useGlobalStore.getState().refresh_token,
  //     }
  //   );
  //   if (response.status !== 200) {
  //     throw redirect("/login");
  //   }
  //   return response.data;
  // }

  public async get<T>(url: string, config?: RetryConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T, D = Record<string, unknown> | FormData>(
    url: string,
    data?: D,
    config?: RetryConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: RetryConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: RetryConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  public async uploadFormData<T>(
    url: string,
    formData: FormData,
    config?: RetryConfig
  ): Promise<T> {
    const headers = new AxiosHeaders({
      ...config?.headers,
      "Content-Type": "multipart/form-data",
    });

    const response = await this.axiosInstance.post<T>(url, formData, {
      ...config,
      headers,
    });
    return response.data;
  }

  public async downloadFile(url: string, config?: RetryConfig): Promise<Blob> {
    const response = await this.axiosInstance.get(url, {
      ...config,
      responseType: "blob",
    });
    return response.data;
  }
}

export const http = new HttpClient();

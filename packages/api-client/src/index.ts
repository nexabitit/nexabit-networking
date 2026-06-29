export interface ApiClientOptions {
  baseUrl: string;
  apiKey?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class NexabitApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  private async request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (this.options.apiKey) {
      headers['X-API-Key'] = this.options.apiKey;
    }

    try {
      const response = await fetch(`${this.options.baseUrl}${path}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || `HTTP ${response.status}` };
      }

      return { success: true, data };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Request failed',
      };
    }
  }

  ipLookup(ip: string) {
    return this.request(`/api/v1/network/ip-lookup?ip=${encodeURIComponent(ip)}`);
  }

  portCheck(host: string, port: number) {
    return this.request(
      `/api/v1/network/port-check?host=${encodeURIComponent(host)}&port=${port}`,
    );
  }

  dnsLookup(domain: string, type: string) {
    return this.request(
      `/api/v1/dns/lookup?domain=${encodeURIComponent(domain)}&type=${type}`,
    );
  }

  sslCheck(hostname: string) {
    return this.request(`/api/v1/ssl/check?hostname=${encodeURIComponent(hostname)}`);
  }

  ping(host: string) {
    return this.request(`/api/v1/network/ping?host=${encodeURIComponent(host)}`);
  }

  whois(query: string) {
    return this.request(`/api/v1/network/whois?query=${encodeURIComponent(query)}`);
  }
}

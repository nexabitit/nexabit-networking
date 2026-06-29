import { Injectable } from '@nestjs/common';

@Injectable()
export class DevService {
  async webhookTest(url: string, method: string, headers: Record<string, string>, body?: string) {
    try {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers,
        body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : body,
        signal: AbortSignal.timeout(30000),
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const responseText = await response.text();

      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseText,
      };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Webhook test failed',
      };
    }
  }
}

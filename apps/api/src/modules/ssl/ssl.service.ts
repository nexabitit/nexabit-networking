import { Injectable } from '@nestjs/common';
import * as tls from 'tls';

@Injectable()
export class SslService {
  async check(hostname: string, port = 443) {
    return new Promise((resolve) => {
      const socket = tls.connect(
        { host: hostname, port, servername: hostname, rejectUnauthorized: false },
        () => {
          const cert = socket.getPeerCertificate();
          socket.end();

          resolve({
            success: true,
            hostname,
            port,
            subject: cert.subject,
            issuer: cert.issuer,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            serialNumber: cert.serialNumber,
            fingerprint: cert.fingerprint,
            fingerprint256: cert.fingerprint256,
            subjectAltName: cert.subjectaltname,
            daysRemaining: cert.valid_to
              ? Math.ceil(
                  (new Date(cert.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                )
              : null,
          });
        },
      );

      socket.on('error', (err) => {
        resolve({ success: false, hostname, error: err.message });
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve({ success: false, hostname, error: 'Connection timed out' });
      });
    });
  }

  async expiry(hostname: string) {
    const result = await this.check(hostname) as {
      success: boolean;
      validTo?: string;
      daysRemaining?: number | null;
      error?: string;
    };

    if (!result.success) return result;

    return {
      success: true,
      hostname,
      validTo: result.validTo,
      daysRemaining: result.daysRemaining,
      expired: (result.daysRemaining ?? 0) < 0,
      expiringSoon: (result.daysRemaining ?? 0) >= 0 && (result.daysRemaining ?? 0) <= 30,
    };
  }
}

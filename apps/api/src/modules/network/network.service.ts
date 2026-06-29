import { Injectable } from '@nestjs/common';
import * as net from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class NetworkService {
  async ipLookup(ip: string) {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,org,as,lat,lon,query`);
      const data = await response.json();

      if (data.status === 'fail') {
        return { success: false, error: data.message || 'Lookup failed' };
      }

      return {
        success: true,
        ip: data.query,
        country: data.country,
        region: data.regionName,
        city: data.city,
        isp: data.isp,
        org: data.org,
        asn: data.as,
        latitude: data.lat,
        longitude: data.lon,
      };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Lookup failed' };
    }
  }

  async portCheck(host: string, port: number, timeout = 5000): Promise<{ open: boolean; error?: string }> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let resolved = false;

      const done = (result: { open: boolean; error?: string }) => {
        if (!resolved) {
          resolved = true;
          socket.destroy();
          resolve(result);
        }
      };

      socket.setTimeout(timeout);
      socket.on('connect', () => done({ open: true }));
      socket.on('timeout', () => done({ open: false, error: 'Connection timed out' }));
      socket.on('error', (err) => done({ open: false, error: err.message }));
      socket.connect(port, host);
    });
  }

  async ping(host: string) {
    const isWindows = process.platform === 'win32';
    const cmd = isWindows ? `ping -n 4 ${host}` : `ping -c 4 ${host}`;

    try {
      const { stdout } = await execAsync(cmd, { timeout: 15000 });
      const avgMatch = stdout.match(/(?:Average|avg)[^\d]*(\d+)/i);
      const packetLoss = stdout.match(/(\d+)%\s*(?:loss|packet loss)/i);

      return {
        success: true,
        host,
        output: stdout,
        avgLatencyMs: avgMatch ? parseInt(avgMatch[1], 10) : null,
        packetLoss: packetLoss ? parseInt(packetLoss[1], 10) : null,
      };
    } catch (e) {
      const err = e as { stdout?: string; message?: string };
      return {
        success: false,
        host,
        output: err.stdout || '',
        error: err.message || 'Ping failed',
      };
    }
  }

  async traceroute(host: string) {
    const isWindows = process.platform === 'win32';
    const cmd = isWindows ? `tracert -d -h 20 ${host}` : `traceroute -n -m 20 ${host}`;

    try {
      const { stdout } = await execAsync(cmd, { timeout: 60000 });
      return { success: true, host, hops: stdout };
    } catch (e) {
      const err = e as { stdout?: string; message?: string };
      return {
        success: false,
        host,
        hops: err.stdout || '',
        error: err.message || 'Traceroute failed',
      };
    }
  }

  async whois(query: string) {
    try {
      const whois = await import('whois-json');
      const result = await whois.default(query);
      return { success: true, query, data: result };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'WHOIS lookup failed' };
    }
  }

  async asnLookup(query: string) {
    try {
      const url = query.match(/^\d+$/)
        ? `https://stat.ripe.net/data/as-overview/data.json?resource=AS${query}`
        : `https://stat.ripe.net/data/prefix-overview/data.json?resource=${encodeURIComponent(query)}`;

      const response = await fetch(url);
      const data = await response.json();

      return { success: true, query, data: data.data };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'ASN lookup failed' };
    }
  }
}

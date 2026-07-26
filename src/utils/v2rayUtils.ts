import { V2RayServer, ProtocolType } from '../types';

/**
 * Generate VMess URI (vmess://)
 * Standard VMess URI uses base64 encoded JSON string
 */
export function generateVMessURI(server: V2RayServer): string {
  const vmessObj = {
    v: '2',
    ps: server.name,
    add: server.address,
    port: String(server.port),
    id: server.uuid,
    aid: String(server.alterId ?? 0),
    scy: server.security || 'auto',
    net: server.network,
    type: 'none',
    host: server.host || server.sni || '',
    path: server.path || '',
    tls: server.tls ? 'tls' : '',
    sni: server.sni || '',
    alpn: server.alpn || '',
    fp: server.fp || 'chrome',
  };

  const jsonStr = JSON.stringify(vmessObj, null, 0);
  const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
  return `vmess://${base64}`;
}

/**
 * Generate VLESS URI (vless://)
 */
export function generateVLESSURI(server: V2RayServer): string {
  const params = new URLSearchParams();
  params.set('type', server.network);
  params.set('security', server.tls ? 'tls' : 'none');

  if (server.sni) params.set('sni', server.sni);
  if (server.host) params.set('host', server.host);

  if (server.network === 'ws' && server.path) {
    params.set('path', server.path);
  } else if (server.network === 'grpc' && server.path) {
    params.set('serviceName', server.path.replace(/^\//, ''));
    params.set('mode', 'gun');
  }

  if (server.fp) params.set('fp', server.fp);
  if (server.alpn) params.set('alpn', server.alpn);

  const encName = encodeURIComponent(server.name);
  return `vless://${server.uuid}@${server.address}:${server.port}?${params.toString()}#${encName}`;
}

/**
 * Generate Trojan URI (trojan://)
 */
export function generateTrojanURI(server: V2RayServer): string {
  const params = new URLSearchParams();
  params.set('type', server.network);
  params.set('security', server.tls ? 'tls' : 'none');

  if (server.sni) params.set('sni', server.sni);
  if (server.host) params.set('host', server.host);

  if (server.network === 'ws' && server.path) {
    params.set('path', server.path);
  } else if (server.network === 'grpc' && server.path) {
    params.set('serviceName', server.path.replace(/^\//, ''));
  }

  if (server.fp) params.set('fp', server.fp);

  const encName = encodeURIComponent(server.name);
  return `trojan://${server.uuid}@${server.address}:${server.port}?${params.toString()}#${encName}`;
}

/**
 * Generate Shadowsocks URI (ss://)
 */
export function generateShadowsocksURI(server: V2RayServer): string {
  const method = server.security || 'aes-256-gcm';
  const userPass = `${method}:${server.uuid}`;
  const base64UserPass = btoa(userPass);
  const encName = encodeURIComponent(server.name);
  return `ss://${base64UserPass}@${server.address}:${server.port}#${encName}`;
}

/**
 * Universal URI generator
 */
export function generateServerURI(server: V2RayServer): string {
  switch (server.protocol) {
    case 'VMess':
      return generateVMessURI(server);
    case 'VLESS':
      return generateVLESSURI(server);
    case 'Trojan':
      return generateTrojanURI(server);
    case 'Shadowsocks':
      return generateShadowsocksURI(server);
    default:
      return generateVLESSURI(server);
  }
}

/**
 * Parses VMess / VLESS / Trojan / SS URI strings back into a V2RayServer object
 */
export function parseV2RayURI(rawUri: string): Partial<V2RayServer> | null {
  try {
    const trimmed = rawUri.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('vmess://')) {
      const base64Part = trimmed.replace('vmess://', '');
      const jsonStr = decodeURIComponent(escape(atob(base64Part)));
      const obj = JSON.parse(jsonStr);
      return {
        name: obj.ps || 'Imported VMess',
        protocol: 'VMess',
        address: obj.add || '',
        port: parseInt(obj.port, 10) || 443,
        uuid: obj.id || '',
        alterId: parseInt(obj.aid, 10) || 0,
        network: (obj.net as any) || 'ws',
        path: obj.path || '',
        host: obj.host || '',
        sni: obj.sni || obj.host || '',
        tls: obj.tls === 'tls',
        security: obj.scy || 'auto',
      };
    }

    if (trimmed.startsWith('vless://') || trimmed.startsWith('trojan://')) {
      const isVless = trimmed.startsWith('vless://');
      const urlStr = trimmed.replace(/^(vless|trojan):\/\//, 'http://');
      const url = new URL(urlStr);

      const name = decodeURIComponent(url.hash.replace('#', '')) || (isVless ? 'Imported VLESS' : 'Imported Trojan');
      const uuid = url.username || '';
      const address = url.hostname;
      const port = parseInt(url.port, 10) || 443;

      const type = (url.searchParams.get('type') as any) || 'ws';
      const security = url.searchParams.get('security');
      const tls = security === 'tls';
      const sni = url.searchParams.get('sni') || url.searchParams.get('host') || '';
      const host = url.searchParams.get('host') || '';
      const path = url.searchParams.get('path') || url.searchParams.get('serviceName') || '';

      return {
        name,
        protocol: isVless ? 'VLESS' : 'Trojan',
        address,
        port,
        uuid,
        network: type,
        tls,
        sni,
        host,
        path,
      };
    }

    if (trimmed.startsWith('ss://')) {
      const urlParts = trimmed.replace('ss://', '').split('#');
      const name = urlParts[1] ? decodeURIComponent(urlParts[1]) : 'Imported Shadowsocks';
      const mainPart = urlParts[0];

      if (mainPart.includes('@')) {
        const [userPassEnc, hostPort] = mainPart.split('@');
        const userPass = atob(userPassEnc);
        const [security, uuid] = userPass.split(':');
        const [address, portStr] = hostPort.split(':');

        return {
          name,
          protocol: 'Shadowsocks',
          address,
          port: parseInt(portStr, 10) || 8388,
          uuid,
          security,
          network: 'tcp',
          tls: false,
        };
      }
    }

    return null;
  } catch (err) {
    console.error('Failed to parse V2Ray URI', err);
    return null;
  }
}

/**
 * Generate Base64 subscription string containing all active URIs
 */
export function generateBase64Subscription(servers: V2RayServer[]): string {
  const uris = servers.map(generateServerURI).join('\n');
  return btoa(unescape(encodeURIComponent(uris)));
}

/**
 * Generate V2Ray JSON configuration format
 */
export function generateV2RayJSONConfig(server: V2RayServer): string {
  const config = {
    log: { loglevel: 'warning' },
    inbounds: [
      {
        port: 10808,
        protocol: 'socks',
        sniffing: { enabled: true, destOverride: ['http', 'tls'] },
        settings: { auth: 'noauth', udp: true },
      },
      {
        port: 10809,
        protocol: 'http',
        settings: {},
      },
    ],
    outbounds: [
      {
        protocol: server.protocol.toLowerCase(),
        settings: {
          vnext: [
            {
              address: server.address,
              port: server.port,
              users: [
                {
                  id: server.uuid,
                  alterId: server.alterId || 0,
                  security: server.security || 'auto',
                  encryption: server.protocol === 'VLESS' ? 'none' : undefined,
                },
              ],
            },
          ],
        },
        streamSettings: {
          network: server.network,
          security: server.tls ? 'tls' : 'none',
          tlsSettings: server.tls
            ? {
                serverName: server.sni || server.address,
                allowInsecure: false,
              }
            : undefined,
          wsSettings:
            server.network === 'ws'
              ? {
                  path: server.path || '/',
                  headers: { Host: server.host || server.address },
                }
              : undefined,
          grpcSettings:
            server.network === 'grpc'
              ? {
                  serviceName: (server.path || '').replace(/^\//, ''),
                  multiMode: false,
                }
              : undefined,
        },
      },
      { protocol: 'freedom', tag: 'direct' },
      { protocol: 'blackhole', tag: 'block' },
    ],
  };

  return JSON.stringify(config, null, 2);
}

/**
 * Generate Clash Provider YAML
 */
export function generateClashYAML(servers: V2RayServer[]): string {
  const proxies = servers.map((s) => {
    if (s.protocol === 'VMess') {
      return `  - name: "${s.name}"
    type: vmess
    server: ${s.address}
    port: ${s.port}
    uuid: ${s.uuid}
    alterId: ${s.alterId || 0}
    cipher: ${s.security || 'auto'}
    udp: true
    network: ${s.network}
    tls: ${s.tls}
    servername: "${s.sni || s.address}"
    ${s.network === 'ws' ? `ws-opts:\n      path: "${s.path || '/'}"\n      headers:\n        Host: "${s.host || s.address}"` : ''}`;
    }
    if (s.protocol === 'VLESS') {
      return `  - name: "${s.name}"
    type: vless
    server: ${s.address}
    port: ${s.port}
    uuid: ${s.uuid}
    udp: true
    tls: ${s.tls}
    servername: "${s.sni || s.address}"
    network: ${s.network}
    ${s.network === 'ws' ? `ws-opts:\n      path: "${s.path || '/'}"\n      headers:\n        Host: "${s.host || s.address}"` : ''}`;
    }
    return `  - name: "${s.name}"
    type: ${s.protocol.toLowerCase()}
    server: ${s.address}
    port: ${s.port}
    password: ${s.uuid}`;
  });

  return `proxies:\n${proxies.join('\n')}`;
}

export type ProtocolType = 'VLESS' | 'VMess' | 'Trojan' | 'Shadowsocks';
export type TransportType = 'ws' | 'grpc' | 'tcp' | 'http';
export type ServerStatus = 'online' | 'busy' | 'offline';
export type SpeedRating = 'Ultra Fast' | 'Fast' | 'Moderate';
export type Language = 'my' | 'en';

export interface V2RayServer {
  id: string;
  name: string;
  countryCode: string; // e.g. 'SG', 'JP', 'US'
  countryName: string;
  flag: string; // Emoji or visual icon code
  protocol: ProtocolType;
  address: string;
  port: number;
  uuid: string; // UUID or Password
  alterId?: number; // For VMess (usually 0)
  security?: string; // auto, aes-128-gcm, chacha20-poly1305, none
  network: TransportType; // ws, grpc, tcp
  path?: string; // e.g. '/v2ray-ws' or 'v2ray-grpc'
  host?: string; // HTTP Host / CDN Host
  sni?: string; // TLS SNI
  tls: boolean;
  alpn?: string; // h2,http/1.1
  fp?: string; // chrome, safari, firefox, randomized
  ping: number; // Ping in ms (-1 if timeout)
  status: ServerStatus;
  speedRating: SpeedRating;
  bandwidth: string; // e.g. "10 Gbps"
  isFavorite?: boolean;
  tags: string[];
  lastTested?: string;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export interface TrafficStats {
  uploadSpeed: number; // KB/s
  downloadSpeed: number; // KB/s
  totalUpload: number; // MB
  totalDownload: number; // MB
  connectedTimeSeconds: number;
  ipAddress: string;
  virtualLocation: string;
}

export interface CustomServerForm {
  name: string;
  countryCode: string;
  countryName: string;
  flag: string;
  protocol: ProtocolType;
  address: string;
  port: number;
  uuid: string;
  network: TransportType;
  path: string;
  host: string;
  sni: string;
  tls: boolean;
  security: string;
}

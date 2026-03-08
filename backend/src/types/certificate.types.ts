export interface SensorBundle {
  gps?: {
    lat: number;
    lng: number;
    altitude?: number;
    accuracy?: number;
    timestamp: number;
  };
  accelerometer?: {
    x: number;
    y: number;
    z: number;
    timestamp: number;
  };
  gyroscope?: {
    x: number;
    y: number;
    z: number;
    timestamp: number;
  };
  barometer?: {
    pressure: number;
    timestamp: number;
  };
  light?: {
    lux: number;
    timestamp: number;
  };
  wifi?: Array<{
    bssid: string;
    ssid?: string;
    rssi: number;
  }>;
  cellTowers?: Array<{
    mcc: number;
    mnc: number;
    lac: number;
    cid: number;
    rssi?: number;
  }>;
  timestamp: number;
}

export interface DeviceInfo {
  model: string;
  os: string;
  appVersion: string;
}

export interface CreateCertificateInput {
  image: Buffer;
  sensorBundle: SensorBundle;
  deviceInfo: DeviceInfo;
  signature: string;
  publicKey: string;
}

export interface CertificateResponse {
  id: string;
  imageHash: string;
  sensorHash: string;
  combinedHash: string;
  ipfsCid?: string | null;
  txHash?: string | null;
  blockNumber?: number | null;
  status: string;
  captureTime: Date;
  createdAt: Date;
}

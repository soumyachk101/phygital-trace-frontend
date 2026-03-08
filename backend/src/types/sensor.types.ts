export interface GPSData {
  lat: number;
  lng: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface GyroscopeData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface BarometerData {
  pressure: number;
  timestamp: number;
}

export interface LightData {
  lux: number;
  timestamp: number;
}

export interface WifiNetwork {
  bssid: string;
  ssid?: string;
  rssi: number;
}

export interface CellTower {
  mcc: number;
  mnc: number;
  lac: number;
  cid: number;
  rssi?: number;
}

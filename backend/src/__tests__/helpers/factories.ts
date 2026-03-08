import { SensorBundle, DeviceInfo } from '../../types/certificate.types';

export function createMockSensorBundle(overrides?: Partial<SensorBundle>): SensorBundle {
  return {
    gps: { lat: 40.7128, lng: -74.006, accuracy: 5, timestamp: Date.now() },
    accelerometer: { x: 0.1, y: 9.8, z: 0.05, timestamp: Date.now() },
    gyroscope: { x: 0.01, y: 0.02, z: 0.03, timestamp: Date.now() },
    barometer: { pressure: 1013.25, timestamp: Date.now() },
    light: { lux: 500, timestamp: Date.now() },
    wifi: [{ bssid: '00:11:22:33:44:55', ssid: 'TestNetwork', rssi: -50 }],
    cellTowers: [{ mcc: 310, mnc: 260, lac: 1234, cid: 5678, rssi: -80 }],
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createMockDeviceInfo(overrides?: Partial<DeviceInfo>): DeviceInfo {
  return {
    model: 'iPhone 15 Pro',
    os: 'iOS 17.2',
    appVersion: '1.0.0',
    ...overrides,
  };
}

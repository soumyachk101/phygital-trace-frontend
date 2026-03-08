import { z } from 'zod/v4';

export const sensorBundleSchema = z.object({
  gps: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    altitude: z.number().optional(),
    accuracy: z.number().optional(),
    timestamp: z.number(),
  }).optional(),
  accelerometer: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    timestamp: z.number(),
  }).optional(),
  gyroscope: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    timestamp: z.number(),
  }).optional(),
  barometer: z.object({
    pressure: z.number(),
    timestamp: z.number(),
  }).optional(),
  light: z.object({
    lux: z.number(),
    timestamp: z.number(),
  }).optional(),
  wifi: z.array(z.object({
    bssid: z.string(),
    ssid: z.string().optional(),
    rssi: z.number(),
  })).optional(),
  cellTowers: z.array(z.object({
    mcc: z.number(),
    mnc: z.number(),
    lac: z.number(),
    cid: z.number(),
    rssi: z.number().optional(),
  })).optional(),
  timestamp: z.number(),
});

export const deviceInfoSchema = z.object({
  model: z.string().min(1),
  os: z.string().min(1),
  appVersion: z.string().min(1),
});

export const listCertificatesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type SensorBundleInput = z.infer<typeof sensorBundleSchema>;
export type DeviceInfoInput = z.infer<typeof deviceInfoSchema>;
export type ListCertificatesInput = z.infer<typeof listCertificatesSchema>;

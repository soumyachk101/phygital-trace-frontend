import { createHash } from 'crypto';

export function computeImageHash(buffer: Buffer): string {
  return '0x' + createHash('sha256').update(buffer).digest('hex');
}

export function computeSensorHash(sensorBundle: Record<string, unknown>): string {
  const canonical = JSON.stringify(sensorBundle, Object.keys(sensorBundle).sort());
  return '0x' + createHash('sha256').update(canonical).digest('hex');
}

export function computeCombinedHash(imageHash: string, sensorHash: string): string {
  const combined = imageHash.replace('0x', '') + sensorHash.replace('0x', '');
  return '0x' + createHash('sha256').update(Buffer.from(combined, 'hex')).digest('hex');
}

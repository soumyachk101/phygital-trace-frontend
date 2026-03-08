import { computeImageHash, computeSensorHash, computeCombinedHash } from '../../utils/hash.utils';

describe('Hash Utilities', () => {
  describe('computeImageHash', () => {
    it('should return a 0x-prefixed SHA-256 hash', () => {
      const buffer = Buffer.from('test image data');
      const hash = computeImageHash(buffer);
      expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
    });

    it('should produce consistent hashes for the same input', () => {
      const buffer = Buffer.from('test image data');
      expect(computeImageHash(buffer)).toBe(computeImageHash(buffer));
    });

    it('should produce different hashes for different input', () => {
      const buffer1 = Buffer.from('image1');
      const buffer2 = Buffer.from('image2');
      expect(computeImageHash(buffer1)).not.toBe(computeImageHash(buffer2));
    });
  });

  describe('computeSensorHash', () => {
    it('should return a 0x-prefixed SHA-256 hash', () => {
      const bundle = { gps: { lat: 40.7, lng: -74.0 }, timestamp: 1234567890 };
      const hash = computeSensorHash(bundle);
      expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
    });

    it('should produce consistent hashes regardless of key order', () => {
      const bundle1 = { a: 1, b: 2 };
      const bundle2 = { b: 2, a: 1 };
      expect(computeSensorHash(bundle1)).toBe(computeSensorHash(bundle2));
    });
  });

  describe('computeCombinedHash', () => {
    it('should return a 0x-prefixed SHA-256 hash', () => {
      const imageHash = '0x' + 'a'.repeat(64);
      const sensorHash = '0x' + 'b'.repeat(64);
      const hash = computeCombinedHash(imageHash, sensorHash);
      expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
    });

    it('should be deterministic', () => {
      const imageHash = '0x' + 'a'.repeat(64);
      const sensorHash = '0x' + 'b'.repeat(64);
      expect(computeCombinedHash(imageHash, sensorHash)).toBe(
        computeCombinedHash(imageHash, sensorHash)
      );
    });
  });
});

import { CertificateRepository } from '../repositories/certificate.repository';
import { computeImageHash } from '../utils/hash.utils';

export class VerifyService {
  private certificateRepo: CertificateRepository;

  constructor(certificateRepo?: CertificateRepository) {
    this.certificateRepo = certificateRepo || new CertificateRepository();
  }

  async verifyByHash(imageHash: string) {
    const certificate = await this.certificateRepo.findByImageHash(imageHash);
    if (!certificate) {
      return {
        verified: false,
        reason: 'NO_CERTIFICATE_FOUND',
        message: 'No certificate found for the provided image hash',
      };
    }

    return {
      verified: certificate.status === 'CONFIRMED',
      certificate,
    };
  }

  async verifyByUpload(imageBuffer: Buffer) {
    const imageHash = computeImageHash(imageBuffer);
    return this.verifyByHash(imageHash);
  }

  async batchVerify(hashes: string[]) {
    const results = await Promise.all(
      hashes.map(async (hash) => {
        const result = await this.verifyByHash(hash);
        return {
          hash,
          verified: result.verified,
          ...(result.verified && 'certificate' in result
            ? { certificateId: result.certificate?.id }
            : { reason: 'reason' in result ? result.reason : undefined }),
        };
      })
    );

    return {
      results,
      summary: {
        total: hashes.length,
        verified: results.filter((r) => r.verified).length,
        notFound: results.filter((r) => !r.verified).length,
      },
    };
  }
}

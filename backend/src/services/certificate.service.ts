import { CertificateRepository } from '../repositories/certificate.repository';
import { AuditLogRepository } from '../repositories/audit-log.repository';
import { computeImageHash, computeSensorHash, computeCombinedHash } from '../utils/hash.utils';
import { ConflictError, NotFoundError } from '../types/errors.types';
import { CreateCertificateInput, CertificateResponse } from '../types/certificate.types';
import { logger } from '../utils/logger';

export class CertificateService {
  private certificateRepo: CertificateRepository;
  private auditLogRepo: AuditLogRepository;

  constructor(certificateRepo?: CertificateRepository, auditLogRepo?: AuditLogRepository) {
    this.certificateRepo = certificateRepo || new CertificateRepository();
    this.auditLogRepo = auditLogRepo || new AuditLogRepository();
  }

  async register(userId: string, input: CreateCertificateInput): Promise<CertificateResponse> {
    const imageHash = computeImageHash(input.image);
    const sensorHash = computeSensorHash(input.sensorBundle as unknown as Record<string, unknown>);
    const combinedHash = computeCombinedHash(imageHash, sensorHash);

    // Check for duplicate
    const existing = await this.certificateRepo.findByImageHash(imageHash);
    if (existing) {
      throw new ConflictError('DUPLICATE_CERTIFICATE', 'A certificate for this image already exists');
    }

    // Create DB record (pending)
    const certificate = await this.certificateRepo.create({
      user: { connect: { id: userId } },
      imageHash,
      sensorHash,
      combinedHash,
      status: 'PENDING',
      captureTime: new Date(input.sensorBundle.timestamp),
      publicKey: input.publicKey,
      signature: input.signature,
      hasGps: !!input.sensorBundle.gps,
      hasAccelerometer: !!input.sensorBundle.accelerometer,
      hasGyroscope: !!input.sensorBundle.gyroscope,
      hasBarometer: !!input.sensorBundle.barometer,
      hasLight: !!input.sensorBundle.light,
      wifiCount: input.sensorBundle.wifi?.length ?? 0,
      cellTowerCount: input.sensorBundle.cellTowers?.length ?? 0,
      latApprox: input.sensorBundle.gps ? Number(input.sensorBundle.gps.lat.toFixed(3)) : null,
      lngApprox: input.sensorBundle.gps ? Number(input.sensorBundle.gps.lng.toFixed(3)) : null,
      deviceModel: input.deviceInfo.model,
      deviceOs: input.deviceInfo.os,
      appVersion: input.deviceInfo.appVersion,
    });

    // Audit log
    await this.auditLogRepo.create({
      userId,
      action: 'CREATE_CERTIFICATE',
      entityType: 'certificate',
      entityId: certificate.id,
      changes: { status: 'PENDING', imageHash },
    });

    logger.info({ certificateId: certificate.id, imageHash }, 'Certificate created');

    // TODO: Pin to IPFS and submit to blockchain asynchronously

    return {
      id: certificate.id,
      imageHash: certificate.imageHash,
      sensorHash: certificate.sensorHash,
      combinedHash: certificate.combinedHash,
      ipfsCid: certificate.ipfsCid,
      txHash: certificate.txHash,
      blockNumber: certificate.blockNumber,
      status: certificate.status,
      captureTime: certificate.captureTime,
      createdAt: certificate.createdAt,
    };
  }

  async getById(id: string) {
    const certificate = await this.certificateRepo.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate');
    }
    return certificate;
  }

  async getByHash(imageHash: string) {
    return this.certificateRepo.findByImageHash(imageHash);
  }

  async listByUser(userId: string, options: { page: number; limit: number; from?: string; to?: string }) {
    return this.certificateRepo.listByUser(userId, options);
  }
}

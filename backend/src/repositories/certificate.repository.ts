import { prisma } from '../config/database';
import { Certificate, CertificateStatus, Prisma } from '@prisma/client';

export class CertificateRepository {
  async findById(id: string) {
    return prisma.certificate.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, displayName: true, handle: true } },
        revocation: true,
      },
    });
  }

  async findByImageHash(imageHash: string) {
    return prisma.certificate.findUnique({
      where: { imageHash },
      include: {
        user: { select: { id: true, displayName: true, handle: true } },
        revocation: true,
      },
    });
  }

  async findByCombinedHash(combinedHash: string) {
    return prisma.certificate.findUnique({
      where: { combinedHash },
    });
  }

  async create(data: Prisma.CertificateCreateInput): Promise<Certificate> {
    return prisma.certificate.create({ data });
  }

  async updateStatus(id: string, status: CertificateStatus, extra?: Prisma.CertificateUpdateInput): Promise<Certificate> {
    return prisma.certificate.update({
      where: { id },
      data: { status, ...extra },
    });
  }

  async listByUser(userId: string, options: { page: number; limit: number; from?: string; to?: string }) {
    const { page, limit, from, to } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.CertificateWhereInput = {
      userId,
      ...(from || to
        ? {
            captureTime: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await prisma.$transaction([
      prisma.certificate.findMany({
        where,
        orderBy: { captureTime: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          imageHash: true,
          ipfsCid: true,
          status: true,
          captureTime: true,
          city: true,
          country: true,
          txHash: true,
        },
      }),
      prisma.certificate.count({ where }),
    ]);

    return { data, total };
  }
}

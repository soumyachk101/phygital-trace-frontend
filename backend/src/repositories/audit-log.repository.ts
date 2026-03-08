import { prisma } from '../config/database';
import { AuditAction, Prisma } from '@prisma/client';

export class AuditLogRepository {
  async create(data: {
    userId?: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    changes?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        changes: data.changes as Prisma.InputJsonValue,
        ipAddress: data.ipAddress,
      },
    });
  }
}

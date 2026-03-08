import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export class WebhookRepository {
  async findByUserId(userId: string) {
    return prisma.webhook.findMany({
      where: { userId, isActive: true },
    });
  }

  async findActiveByEvent(event: string) {
    return prisma.webhook.findMany({
      where: { isActive: true, events: { has: event } },
    });
  }

  async create(data: Prisma.WebhookCreateInput) {
    return prisma.webhook.create({ data });
  }

  async createDelivery(data: Prisma.WebhookDeliveryCreateInput) {
    return prisma.webhookDelivery.create({ data });
  }
}

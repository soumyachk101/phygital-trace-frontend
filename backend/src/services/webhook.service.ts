import { WebhookRepository } from '../repositories/webhook.repository';
import { logger } from '../utils/logger';

export class WebhookService {
  private webhookRepo: WebhookRepository;

  constructor(webhookRepo?: WebhookRepository) {
    this.webhookRepo = webhookRepo || new WebhookRepository();
  }

  async deliver(event: string, _data: Record<string, unknown>): Promise<void> {
    const webhooks = await this.webhookRepo.findActiveByEvent(event);

    for (const webhook of webhooks) {
      try {
        // TODO: Implement actual HTTP delivery with retry
        logger.info({ webhookId: webhook.id, event }, 'Webhook delivery (not yet implemented)');
      } catch (error) {
        logger.error({ webhookId: webhook.id, event, error }, 'Webhook delivery failed');
      }
    }
  }
}

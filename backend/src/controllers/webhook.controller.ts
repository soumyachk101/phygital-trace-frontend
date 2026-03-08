import { Request, Response } from 'express';

export class WebhookController {
  static async create(_req: Request, res: Response): Promise<void> {
    // TODO: Implement webhook creation
    res.status(201).json({ success: true, data: { message: 'Webhook creation not yet implemented' } });
  }

  static async list(_req: Request, res: Response): Promise<void> {
    // TODO: Implement webhook listing
    res.json({ success: true, data: [] });
  }
}

import { Request, Response } from 'express';
import { CertificateService } from '../services/certificate.service';

const certificateService = new CertificateService();

export class CertificateController {
  static async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const image = req.file!.buffer;
    const sensorBundle = JSON.parse(req.body.sensorBundle);
    const deviceInfo = JSON.parse(req.body.deviceInfo);
    const { signature, publicKey } = req.body;

    const result = await certificateService.register(userId, {
      image,
      sensorBundle,
      deviceInfo,
      signature,
      publicKey,
    });

    res.status(201).json({ success: true, data: result });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const certificate = await certificateService.getById(req.params.id as string);
    res.json({ success: true, data: certificate });
  }

  static async list(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page, limit, from, to } = req.query as {
      page?: string;
      limit?: string;
      from?: string;
      to?: string;
    };

    const result = await certificateService.listByUser(userId, {
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
      from,
      to,
    });

    res.json({ success: true, ...result });
  }
}

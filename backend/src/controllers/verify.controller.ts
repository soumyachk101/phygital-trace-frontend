import { Request, Response } from 'express';
import { VerifyService } from '../services/verify.service';

const verifyService = new VerifyService();

export class VerifyController {
  static async verifyByHash(req: Request, res: Response): Promise<void> {
    const { imageHash } = req.body;
    const result = await verifyService.verifyByHash(imageHash);
    res.json({ success: true, data: result });
  }

  static async verifyByUpload(req: Request, res: Response): Promise<void> {
    const imageBuffer = req.file!.buffer;
    const result = await verifyService.verifyByUpload(imageBuffer);
    res.json({ success: true, data: result });
  }

  static async batchVerify(req: Request, res: Response): Promise<void> {
    const { hashes } = req.body;
    const result = await verifyService.batchVerify(hashes);
    res.json({ success: true, data: result });
  }
}

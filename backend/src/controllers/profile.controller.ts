import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';

const profileService = new ProfileService();

export class ProfileController {
  static async getPublicProfile(req: Request, res: Response): Promise<void> {
    const result = await profileService.getPublicProfile(req.params.handle as string);
    res.json({ success: true, data: result });
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const result = await profileService.updateProfile(userId, req.body);
    res.json({ success: true, data: result });
  }
}

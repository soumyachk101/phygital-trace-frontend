import { logger } from '../utils/logger';

export class EmailService {
  async sendVerificationEmail(_to: string, _token: string): Promise<void> {
    // TODO: Implement Resend API integration
    logger.info('Email sendVerificationEmail called (not yet implemented)');
  }

  async sendWelcomeEmail(_to: string, _displayName: string): Promise<void> {
    logger.info('Email sendWelcomeEmail called (not yet implemented)');
  }
}

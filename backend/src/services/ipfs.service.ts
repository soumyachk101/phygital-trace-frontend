import { logger } from '../utils/logger';

export class IPFSService {
  async pin(_payload: Record<string, unknown>): Promise<string> {
    // TODO: Implement Pinata API integration
    logger.info('IPFS pin called (not yet implemented)');
    return 'QmPlaceholderCID';
  }

  async get(cid: string): Promise<Record<string, unknown> | null> {
    logger.info({ cid }, 'IPFS get called (not yet implemented)');
    return null;
  }

  async isPinned(cid: string): Promise<boolean> {
    logger.info({ cid }, 'IPFS isPinned called (not yet implemented)');
    return false;
  }
}

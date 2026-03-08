import { ethers } from 'ethers';
import { createProvider } from '../config/blockchain';
import { logger } from '../utils/logger';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = createProvider();
  }

  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  async registerCertificate(
    _combinedHash: string,
    _ipfsCid: string,
    _signature: string
  ): Promise<string> {
    // TODO: Implement contract interaction
    logger.info('Blockchain registerCertificate called (not yet implemented)');
    return '0x0000000000000000000000000000000000000000000000000000000000000000';
  }

  async waitForConfirmation(txHash: string, confirmations = 1): Promise<ethers.TransactionReceipt | null> {
    return this.provider.waitForTransaction(txHash, confirmations);
  }
}

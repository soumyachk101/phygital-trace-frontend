import { ethers } from 'ethers';
import { config } from './index';

export function createProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
}

export function createWallet(provider: ethers.JsonRpcProvider): ethers.Wallet | null {
  if (!config.blockchain.privateKey) return null;
  return new ethers.Wallet(config.blockchain.privateKey, provider);
}

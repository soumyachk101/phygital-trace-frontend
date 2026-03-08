import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { config } from '../config';
import { UserRepository } from '../repositories/user.repository';
import { ConflictError, UnauthorizedError } from '../types/errors.types';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 12;

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async register(email: string, password: string, displayName: string) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('EMAIL_ALREADY_EXISTS', 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepository.create({
      email,
      passwordHash,
      displayName,
    });

    logger.info({ userId: user.id }, 'User registered');

    const tokens = this.generateTokens(user.id, user.email, user.tier);
    return { user: { id: user.id, email: user.email, displayName: user.displayName }, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.info({ userId: user.id }, 'User logged in');

    const tokens = this.generateTokens(user.id, user.email, user.tier);
    return { user: { id: user.id, email: user.email, displayName: user.displayName }, ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.secret) as { sub: string; email: string; tier: string; type: string };
      if (payload.type !== 'refresh') {
        throw new UnauthorizedError('Invalid refresh token');
      }
      return this.generateTokens(payload.sub, payload.email, payload.tier);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string, email: string, tier: string) {
    const accessToken = jwt.sign(
      { sub: userId, email, tier },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as StringValue }
    );

    const refreshToken = jwt.sign(
      { sub: userId, email, tier, type: 'refresh' },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn as StringValue }
    );

    return { accessToken, refreshToken };
  }
}

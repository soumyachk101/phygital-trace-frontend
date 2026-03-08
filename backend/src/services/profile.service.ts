import { UserRepository } from '../repositories/user.repository';
import { CertificateRepository } from '../repositories/certificate.repository';
import { NotFoundError } from '../types/errors.types';

export class ProfileService {
  private userRepo: UserRepository;
  private certificateRepo: CertificateRepository;

  constructor(userRepo?: UserRepository, certificateRepo?: CertificateRepository) {
    this.userRepo = userRepo || new UserRepository();
    this.certificateRepo = certificateRepo || new CertificateRepository();
  }

  async getPublicProfile(handle: string) {
    const user = await this.userRepo.findByHandle(handle);
    if (!user) {
      throw new NotFoundError('User');
    }

    const { data: recentCertificates } = await this.certificateRepo.listByUser(user.id, {
      page: 1,
      limit: 5,
    });

    return {
      userId: user.id,
      displayName: user.displayName,
      handle: user.handle,
      bio: user.bio,
      twitterUrl: user.twitterUrl,
      websiteUrl: user.websiteUrl,
      recentCertificates,
    };
  }

  async updateProfile(userId: string, data: { displayName?: string; bio?: string; twitterUrl?: string | null; websiteUrl?: string | null }) {
    const user = await this.userRepo.update(userId, data);
    return {
      userId: user.id,
      displayName: user.displayName,
      handle: user.handle,
      bio: user.bio,
      twitterUrl: user.twitterUrl,
      websiteUrl: user.websiteUrl,
    };
  }
}

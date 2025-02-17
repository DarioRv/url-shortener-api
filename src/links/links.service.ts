import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entity/link.entity';
import { Repository } from 'typeorm';
import { CreateShortUrlDto } from './dto/create-short-url.dto';

@Injectable()
export class LinksService {
  private readonly log = new Logger(LinksService.name);

  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  async createShortLink(CreateShortUrlDto: CreateShortUrlDto): Promise<string> {
    const { url, name, expirationDate } = CreateShortUrlDto;

    const shortCode = `${name.replace(/\s/g, '-')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = expirationDate
      ? new Date(Date.now() + this.getExpirationTime(expirationDate))
      : null;
    const shortLink = this.linksRepository.create({
      originalUrl: url,
      shortCode,
      expiresAt,
    });

    try {
      await this.linksRepository.save(shortLink);
      return shortCode;
    } catch (error) {
      this.log.error(
        `Couldn't create short link for URL: ${url} - Details: ${error.message}`,
      );
      throw new InternalServerErrorException("Couldn't create short link");
    }
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const link = await this.linksRepository.findOneBy({ shortCode });

    if (!link || (link.expiresAt && link.expiresAt < new Date())) {
      this.log.log(`Short link not found: ${shortCode}`);
      throw new NotFoundException('Short link not found');
    }

    return link.originalUrl;
  }

  private getExpirationTime(expirationDate: string): number {
    const expirationTimes = {
      '5min': 5 * 60 * 1000,
      '15min': 15 * 60 * 1000,
      '30min': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
    };

    return expirationTimes[expirationDate];
  }
}

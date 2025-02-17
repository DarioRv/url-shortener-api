import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateShortUrlDto {
  @ApiProperty({
    description: 'The URL to shorten',
    example: 'https://www.google.com',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description:
      'The name of the short URL. This will be used as the short code.',
    example: 'google',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'The expiration date of the short URL. If not provided, the short URL will never expire.',
    example: '2022-12-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(5min|15min|30min|1h|1d|1w)$/, {
    message:
      'Expiration date must be one of the following: 5min, 15min, 30min, 1h, 1d, 1w',
  })
  expirationDate: '5min' | '15min' | '30min' | '1h' | '1d' | '1w';
}

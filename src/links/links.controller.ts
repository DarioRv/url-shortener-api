import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @ApiCreatedResponse({
    description: 'The short URL has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'The provided URL is invalid.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while creating the short URL.',
  })
  @Post()
  async createShortLink(@Body() createShortUrlDto: CreateShortUrlDto) {
    const shortCode =
      await this.linksService.createShortLink(createShortUrlDto);
    const shortUrl = `${process.env.BASE_URL}/api/links/${shortCode}`;

    return { shortUrl };
  }

  @ApiResponse({
    status: 302,
    description: 'Redirects to the original URL.',
  })
  @ApiNotFoundResponse({
    description: 'The short URL was not found.',
  })
  @Get(':shortCode')
  async getOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.linksService.getOriginalUrl(shortCode);
    return res.redirect(originalUrl);
  }
}

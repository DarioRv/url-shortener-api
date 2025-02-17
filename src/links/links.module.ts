import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entity/link.entity';

@Module({
  controllers: [LinksController],
  providers: [LinksService],
  imports: [TypeOrmModule.forFeature([Link])],
  exports: [TypeOrmModule],
})
export class LinksModule {}

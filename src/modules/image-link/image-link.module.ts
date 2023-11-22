import { Module } from '@nestjs/common';
import { ImageLinkService } from './image-link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageLink } from './entities/image-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageLink])],
  providers: [ImageLinkService],
  exports: [ImageLinkService],
})
export class ImageLinkModule {}

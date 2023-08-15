import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './entities/gallery.entity';
import { TagModule } from 'src/tag/tag.module';
import { GalleryResolver } from './gallery.resolver';

@Module({
  imports: [ TypeOrmModule.forFeature([Gallery]) , TagModule ],
  controllers: [GalleryController],
  providers: [GalleryService , GalleryResolver],
  exports : [GalleryService]
})
export class GalleryModule {}

import { Module , forwardRef } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import {GalleryModule} from 'src/gallery/gallery.module'

@Module({
  imports: [ TypeOrmModule.forFeature([Tag]) ,
  forwardRef(() => GalleryModule)
  ],

  providers: [TagResolver, TagService] ,
  exports: [TagService]
})
export class TagModule {}

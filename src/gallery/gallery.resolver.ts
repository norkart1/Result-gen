import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Gallery } from './entities/gallery.entity';
import { GalleryService } from './gallery.service';

@Resolver(() => Gallery)
export class GalleryResolver {
  constructor(private readonly galleryService: GalleryService) {}

  @Query(() => [Gallery], { name: 'galleries' })
  findAll() {
    return this.galleryService.findAll();
  }

  @Query(() => Gallery, { name: 'gallery' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.galleryService.findOne(id);
  }

  @Mutation(() => Gallery)
  removeGallery(@Args('id') id: number) {
    return this.galleryService.remove(id);
  }
}

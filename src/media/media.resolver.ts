import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { AuthPipe } from './pipe/auth.pipe';
import { UsePipes } from '@nestjs/common';

@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @UsePipes(AuthPipe)
  @Mutation(() => Media)
  createMedia(@Args('createMediaInput') createMediaInput: CreateMediaInput) {
    return this.mediaService.create(createMediaInput);
  }

  @Query(() => [Media], { name: 'media' })
  findAll() {
    return this.mediaService.findAll();
  }

  @Query(() => Media, { name: 'media' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mediaService.findOne(id);
  }

  @UsePipes(AuthPipe)
  @Mutation(() => Media)
  updateMedia(@Args('updateMediaInput') updateMediaInput: UpdateMediaInput) {
    return this.mediaService.update(updateMediaInput.id, updateMediaInput);
  }

  @Mutation(() => Media)
  removeMedia(@Args('id', { type: () => Int }) id: number) {
    return this.mediaService.remove(id);
  }
}

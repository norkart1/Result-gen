import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FeedsService } from './feeds.service';
import { Feed } from './entities/feed.entity';
import { CreateFeedInput } from './dto/create-feed.input';
import { UpdateFeedInput } from './dto/update-feed.input';

@Resolver(() => Feed)
export class FeedsResolver {
  constructor(private readonly feedsService: FeedsService) {}

  @Mutation(() => Feed)
  createFeed(@Args('createFeedInput') createFeedInput: CreateFeedInput) {
    return this.feedsService.create(createFeedInput);
  }

  @Query(() => [Feed], { name: 'feeds' })
  findAll() {
    return this.feedsService.findAll();
  }

  @Query(() => Feed, { name: 'feed' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.feedsService.findOne(id);
  }

  @Mutation(() => Feed)
  updateFeed(@Args('updateFeedInput') updateFeedInput: UpdateFeedInput) {
    return this.feedsService.update(updateFeedInput.id, updateFeedInput);
  }

  @Mutation(() => Feed)
  removeFeed(@Args('id', { type: () => Int }) id: number) {
    return this.feedsService.remove(id);
  }
}

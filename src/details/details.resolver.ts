import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DetailsService } from './details.service';
import { Detail } from './entities/detail.entity';
import { CreateDetailInput } from './dto/create-detail.input';
import { UpdateDetailInput } from './dto/update-detail.input';

@Resolver(() => Detail)
export class DetailsResolver {
  constructor(private readonly detailsService: DetailsService) {}

  @Mutation(() => Detail)
  createDetail(@Args('createDetailInput') createDetailInput: CreateDetailInput) {
    return this.detailsService.create(createDetailInput);
  }

  @Query(() => [Detail], { name: 'details' })
  findAll() {
    return this.detailsService.findAll();
  }

  @Mutation(() => Detail)
  updateDetail(@Args('updateDetailInput') updateDetailInput: UpdateDetailInput) {
    return this.detailsService.update(updateDetailInput.id, updateDetailInput);
  }

}

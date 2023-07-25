import { Resolver, Query, Mutation, Args, Int, Info } from '@nestjs/graphql';
import { DetailsService } from './details.service';
import { Detail } from './entities/detail.entity';
import { CreateDetailInput } from './dto/create-detail.input';
import { UpdateDetailInput } from './dto/update-detail.input';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';
import { UseGuards } from '@nestjs/common';
import { fieldsProjection } from 'graphql-fields-list';

@Resolver(() => Detail)
export class DetailsResolver {
  constructor(private readonly detailsService: DetailsService) {}

  @Mutation(() => Detail)
  @HasRoles(Roles.Admin )
  @UseGuards(RolesGuard)
  createDetail(@Args('createDetailInput') createDetailInput: CreateDetailInput) {
    return this.detailsService.create(createDetailInput);
  }

  @Query(() => Detail, { name: 'details' })
  find(
@Info() info : any,
  ) {
    const fields = Object.keys(fieldsProjection(info));
    return this.detailsService.find( fields );
  }

  @Mutation(() => Detail)
  @HasRoles(Roles.Admin )
  @UseGuards(RolesGuard)
  updateDetail(@Args('updateDetailInput') updateDetailInput: UpdateDetailInput) {
    return this.detailsService.update(updateDetailInput.id, updateDetailInput);
  }

}

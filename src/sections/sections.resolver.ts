import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SectionsService } from './sections.service';
import { Section } from './entities/section.entity';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { UseGuards, UsePipes } from '@nestjs/common';
import { AuthPipe } from './pipe/auth.pipe';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';

@Resolver(() => Section)
export class SectionsResolver {
  constructor(private readonly sectionsService: SectionsService) {}

  @Mutation(() => Section)
  @UsePipes(AuthPipe)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  createSection(@Args('createSectionInput') createSectionInput: CreateSectionInput) {
    return this.sectionsService.create(createSectionInput);
  }

  @Query(() => [Section], { name: 'sections' })
  findAll() {
    return this.sectionsService.findAll();
  }

  @Query(() => Section, { name: 'section' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sectionsService.findOne(id);
  }

  @Mutation(() => Section)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  updateSection(@Args('updateSectionInput') updateSectionInput: UpdateSectionInput) {
    return this.sectionsService.update(updateSectionInput.id, updateSectionInput);
  }

  @Mutation(() => Section)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  removeSection(@Args('id', { type: () => Int }) id: number) {
    return this.sectionsService.remove(id);
  }
}

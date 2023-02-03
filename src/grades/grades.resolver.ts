import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GradesService } from './grades.service';
import { Grade } from './entities/grade.entity';
import { CreateGradeInput } from './dto/create-grade.input';
import { UpdateGradeInput } from './dto/update-grade.input';

@Resolver(() => Grade)
export class GradesResolver {
  constructor(private readonly gradesService: GradesService) {}

  @Mutation(() => Grade)
  createGrade(@Args('createGradeInput') createGradeInput: CreateGradeInput) {
    return this.gradesService.create(createGradeInput);
  }

  @Query(() => [Grade], { name: 'grades' })
  findAll() {
    return this.gradesService.findAll();
  }

  @Query(() => Grade, { name: 'grade' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gradesService.findOne(id);
  }

  @Mutation(() => Grade)
  updateGrade(@Args('updateGradeInput') updateGradeInput: UpdateGradeInput) {
    return this.gradesService.update(updateGradeInput.id, updateGradeInput);
  }

  @Mutation(() => Grade)
  removeGrade(@Args('id', { type: () => Int }) id: number) {
    return this.gradesService.remove(id);
  }
}

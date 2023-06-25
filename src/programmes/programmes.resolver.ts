import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ProgrammesService } from './programmes.service';
import { Programme } from './entities/programme.entity';
import { CreateProgrammeInput } from './dto/create-programme.input';
import { UpdateProgrammeInput } from './dto/update-programme.input';
import { UseGuards } from '@nestjs/common';
import { CreateSchedule } from './dto/create-schedule.dto';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';

@Resolver(() => Programme)
export class ProgrammesResolver {
  constructor(private readonly programmesService: ProgrammesService) {}

  // @UsePipes(AuthPipe)
  @Mutation(() => Programme)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  createProgramme(
    @Args('createProgrammeInput') createProgrammeInput: CreateProgrammeInput,
    @Context('req') req: any,
  ) {
    return this.programmesService.create(createProgrammeInput, req.user);
  }

  @Mutation(() => [Programme])
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  createManyProgrammes(
    @Args('createProgrammeInput', { type: () => [CreateProgrammeInput] })
    createProgrammeInput: CreateProgrammeInput[],
    @Context('req') req: any,
  ) {
    return this.programmesService.createMany(createProgrammeInput, req.user);
  }

  @Query(() => [Programme], { name: 'programmes' })
  findAll() {
    return this.programmesService.findAll();
  }

  @Query(() => Programme, { name: 'programme' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.programmesService.findOne(id);
  }

  @Mutation(() => Programme)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  updateProgramme(
    @Args('updateProgrammeInput') updateProgrammeInput: UpdateProgrammeInput,
    @Context('req') req: any,
  ) {
    return this.programmesService.update(updateProgrammeInput.id, updateProgrammeInput, req.user);
  }

  @Mutation(() => Programme)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  removeProgramme(@Args('id', { type: () => Int }) id: number, @Context('req') req: any) {
    return this.programmesService.remove(id, req.user);
  }

  @Mutation(() => Programme)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  setSchedule(
    @Args('createScheduleInput') createSchedule: CreateSchedule,
    @Context('req') req: any,
  ) {
    return this.programmesService.setSchedule(createSchedule, req.user);
  }

  @Mutation(() => [Programme])
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  setManySchedule(
    @Args('createScheduleInput', { type: () => [CreateSchedule] }) createSchedule: CreateSchedule[],
    @Context('req') req: any,
  ) {
    return this.programmesService.setManySchedule(createSchedule, req.user);
  }

  @Mutation(() => Programme)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  removeSchedule(@Args('code', { type: () => Int }) code: string, @Context('req') req: any) {
    return this.programmesService.removeSchedule(code, req.user);
  }
}

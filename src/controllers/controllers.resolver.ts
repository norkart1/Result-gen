import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ControllersService } from './controllers.service';
import { Controller } from './entities/controller.entity';
import { CreateControllerInput } from './dto/create-controller.input';
import { UpdateControllerInput } from './dto/update-controller.input';

@Resolver(() => Controller)
export class ControllersResolver {
  constructor(private readonly controllersService: ControllersService) {}

  @Mutation(() => Controller)
  createController(@Args('createControllerInput') createControllerInput: CreateControllerInput) {
    return this.controllersService.create(createControllerInput);
  }

  @Query(() => [Controller], { name: 'controllers' })
  findAll() {
    return this.controllersService.findAll();
  }

  @Query(() => Controller, { name: 'controller' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.controllersService.findOne(id);
  }

  @Mutation(() => Controller)
  updateController(@Args('updateControllerInput') updateControllerInput: UpdateControllerInput) {
    return this.controllersService.update(updateControllerInput.id, updateControllerInput);
  }

  @Mutation(() => Controller)
  removeController(@Args('id', { type: () => Int }) id: number) {
    return this.controllersService.remove(id);
  }
}

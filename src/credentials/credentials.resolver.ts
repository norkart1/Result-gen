import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CredentialsService } from './credentials.service';
import { Credential } from './entities/credential.entity';
import { CreateCredentialInput } from './dto/create-credential.input';
import { UpdateCredentialInput } from './dto/update-credential.input';
import { HasRoles, RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.enum';
import { UseGuards, UsePipes } from '@nestjs/common';
import { LoginService } from './login/login.service';

@Resolver(() => Credential)
export class CredentialsResolver {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly LoginService: LoginService,
  ) {}

  @Mutation(() => Credential)
  // @UsePipes(AuthPipe)
  @HasRoles(Roles.Controller, Roles.Admin, Roles.TeamManager)
  @UseGuards(RolesGuard)
  createCredential(
    @Args('createCredentialInput') createCredentialInput: CreateCredentialInput,
    @Context('req') req: any,
  ) {
    return this.credentialsService.create(createCredentialInput, req.user);
  }

  // @HasRoles(Roles.Controller, Roles.Admin, Roles.TeamManager)
  // @UseGuards(RolesGuard)
  @Query(() => [Credential], { name: 'credentials' })
  findAll() {
    return this.credentialsService.findAll();
  }

  @HasRoles(Roles.Controller, Roles.Admin, Roles.TeamManager)
  @UseGuards(RolesGuard)
  @Query(() => Credential, { name: 'credential' })
  findOne(@Args('id', { type: () => Int }) id: number, @Context('req') request: any) {
    return this.credentialsService.findOne(id, request.user);
  }

  @Mutation(() => Credential)
  @HasRoles(Roles.Controller, Roles.Admin, Roles.TeamManager)
  @UseGuards(RolesGuard)
  updateCredential(
    @Args('updateCredentialInput') updateCredentialInput: UpdateCredentialInput,
    @Context('req') request: any,
  ) {
    return this.credentialsService.update(updateCredentialInput, request.user);
  }

  @Mutation(() => Credential)
  @HasRoles(Roles.Controller, Roles.Admin, Roles.TeamManager)
  @UseGuards(RolesGuard)
  removeCredential(@Args('id', { type: () => Int }) id: number, @Context('req') request: any) {
    return this.credentialsService.remove(id, request.user);
  }
}

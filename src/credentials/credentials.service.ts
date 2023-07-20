import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCredentialInput } from './dto/create-credential.input';
import { UpdateCredentialInput } from './dto/update-credential.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential } from './entities/credential.entity';
import { CategoryService } from 'src/category/category.service';
import { TeamsService } from 'src/teams/teams.service';
import { Category } from 'src/category/entities/category.entity';
import { LoginService } from './login/login.service';
import { Roles } from './roles/roles.enum';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(Credential) private CredentialRepository: Repository<Credential>,
    private readonly teamService: TeamsService,
    private readonly categoryService: CategoryService,
    private readonly LoginService: LoginService,
  ) {}

  async create(createCredentialInput: CreateCredentialInput, user: Credential) {
    let { username, password, categories, roles, team } = createCredentialInput;

    const alreadyUser = await this.CredentialRepository.findOne({
      where: {
        username,
      },
    });
    if (alreadyUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const allCategories = await this.categoryService.findAll();
    const allCategoriesNames = allCategories.map(category => category.name);

    // the the users role and check if he is allowed to create a new user
    const userRole = user.roles;

    if (userRole.includes(Roles.Admin)) {
      // admin can create any user
      categories = allCategoriesNames;
    } else if (
      userRole.includes(Roles.Controller) &&
      this.checkCategoriesEquality(user.categories, allCategories)
    ) {
      roles = [Roles.Controller];
      team = null;
    } else if (
      userRole.includes(Roles.TeamManager) &&
      this.checkCategoriesEquality(user.categories, allCategories)
    ) {
      team = user.team.name;
    } else {
      throw new HttpException('You are not allowed to create a new user', HttpStatus.UNAUTHORIZED);
    }

    const StringRoles = JSON.stringify(roles);
    let teamId = null;
    if (team) {
      teamId = await this.teamService.findOneByName(team);
    }
    let categoriesId = null;
    if (categories) {
      categoriesId = await this.categoriesMapper(categories);
    }

    let hashedPassword = await this.LoginService.hashPassword(password);

    const newCredential = this.CredentialRepository.create({
      username,
      password: hashedPassword,
      roles: StringRoles,
      team: teamId,
      categories: categoriesId,
    });

    return this.CredentialRepository.save(newCredential);
  }

  findAll() {
    return this.CredentialRepository.find({
      relations: ['team', 'categories'],
    });
  }

  findOne(id: number, user: Credential) {
    return this.CredentialRepository.findOne({
      where: {
        id,
      },
      relations: ['team', 'categories'],
    });
  }

  findOneByUsername(username: string) {
    return this.CredentialRepository.findOne({
      where: {
        username,
      },
      relations: ['team', 'categories'],
    });
  }

  async update(updateCredentialInput: UpdateCredentialInput, user: Credential) {
    let { id, categories, team, password, roles, username } = updateCredentialInput;

    const alreadyUser = await this.CredentialRepository.findOne({
      where: {
        username,
      },
    });
    if (alreadyUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const allCategories = await this.categoryService.findAll();
    const allCategoriesNames = allCategories.map(category => category.name);

    // the the users role and check if he is allowed to create a new user
    const userRole = user.roles;

    if (userRole.includes(Roles.Admin)) {
      // admin can create any user
      categories = allCategoriesNames;
    } else if (
      userRole.includes(Roles.Controller) &&
      this.checkCategoriesEquality(user.categories, allCategories)
    ) {
      roles = [Roles.Controller];
      team = null;
    } else if (
      userRole.includes(Roles.TeamManager) &&
      this.checkCategoriesEquality(user.categories, allCategories)
    ) {
      team = user.team.name;
    } else {
      throw new HttpException('You are not allowed to create a new user', HttpStatus.UNAUTHORIZED);
    }

    const StringRoles = JSON.stringify(roles);
    let teamId = null;
    if (team) {
      teamId = await this.teamService.findOneByName(team);
    }
    let categoriesId = null;
    if (categories) {
      categoriesId = await this.categoriesMapper(categories);
    }

    let hashedPassword = await this.LoginService.hashPassword(password);

    return this.CredentialRepository.update(id, {
      username,
      password: hashedPassword,
      roles: StringRoles,
      team: teamId,
      categories: categoriesId,
    });
  }

  async remove(id: number, user: Credential) {
    
    const credential: Credential = await this.findOne(id, user);
    if (!credential) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let { categories, roles, team } = credential;

    const allCategories : Category[] = await this.categoryService.findAll();
    const allCategoriesNames = allCategories.map(category => category.name);

    // the the users role and check if he is allowed to create a new user
    const userRole = user.roles;

    if (userRole.includes(Roles.Admin)) {
      // admin can remove preimum users only
      return this.CredentialRepository.delete(id);
    } else if (
      userRole.includes(Roles.Controller) &&
      this.checkCategoriesEquality(user.categories, allCategories) &&
      roles.includes(Roles.Controller)
    ) {
      return this.CredentialRepository.delete(id);
    } else if (
      userRole.includes(Roles.TeamManager) &&
      this.checkCategoriesEquality(user.categories, allCategories) &&
      roles.includes(Roles.TeamManager)
    ) {
      return this.CredentialRepository.delete(id);
    } else {
      throw new HttpException('You are not allowed to remove this user', HttpStatus.UNAUTHORIZED);
      return null;
    }
  }

  async categoriesMapper(categories: string[]) {
    const FindedCategories: Category[] = [];
    for (const category of categories) {
      const FindedCategory = await this.categoryService.findOneByName(category);
      FindedCategories.push(FindedCategory);
    }

    return FindedCategories;
  }

  checkCategoriesEquality(categoryOne : any , categoryTwo : any) {
    if (categoryOne.length !== categoryTwo.length) {
      return false; // Arrays have different lengths, not equal
    }

    const names1 = categoryOne.map(obj => obj.name).sort();
    const names2 = categoryTwo.map(obj => obj.name).sort();

    for (let i = 0; i < names1.length; i++) {
      if (names1[i] !== names2[i]) {
        return false; // Names at corresponding index are not equal
      }
    }

    return true; // All objects have equal names
  }

  async checkPermissionOnCategories(user: Credential, categoryName: string) {
    // authenticating the user have permission to update the category

    const category = await this.categoryService.findOneByName(categoryName);

    if (!category) {
      throw new HttpException(`Cant find a category named ${categoryName}`, HttpStatus.BAD_REQUEST);
    }

    const categoryExists = user.categories?.some(category => category.name === category.name);

    if (!categoryExists) {
      throw new HttpException(
        `You don't have permission to access the category ${category.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }


  async checkPermissionOnTeam(user: Credential, teamName: string) {
    const team = await this.teamService.findOneByName(teamName);

    if (!team) {
      throw new HttpException(`Cant find a team named ${teamName}`, HttpStatus.BAD_REQUEST);
    }

    const teamExists = user.team?.name === team.name;

    if (!teamExists) {
      throw new HttpException(
        `You don't have permission to access the team ${team.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

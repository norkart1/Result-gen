import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateProgrammeInput } from './dto/create-candidate-programme.input';
import { UpdateCandidateProgrammeInput } from './dto/update-candidate-programme.input';
import { CandidateProgramme } from './entities/candidate-programme.entity';
import { CandidatesService } from 'src/candidates/candidates.service';
import { ProgrammesService } from 'src/programmes/programmes.service';
import { Category } from 'src/category/entities/category.entity';
import { Programme } from 'src/programmes/entities/programme.entity';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { CategorySettings } from 'src/category-settings/entities/category-setting.entity';
import { Type } from 'src/programmes/dto/create-programme.input';
import { Team } from 'src/teams/entities/team.entity';
import { CategoryService } from 'src/category/category.service';
import { ResultGenService } from './result-gen.service';
import { Credential } from 'src/credentials/entities/credential.entity';
import { DetailsService } from 'src/details/details.service';
import { CategorySettingsService } from 'src/category-settings/category-settings.service';

@Injectable()
export class CandidateProgrammeService {
  constructor(
    @InjectRepository(CandidateProgramme)
    private candidateProgrammeRepository: Repository<CandidateProgramme>,
    private readonly candidateService: CandidatesService,
    private readonly programmeService: ProgrammesService,
    private readonly categoryService: CategoryService,
    private readonly detailService: DetailsService,
    private readonly categorySettingsService: CategorySettingsService,
  ) {}

  teamCandidates(candidateProgrammes: CandidateProgramme[], team: Team) {
    return candidateProgrammes.filter((e: CandidateProgramme) => {
      return e.candidate?.team?.name == team.name;
    });
  }

  async create(createCandidateProgrammeInput: CreateCandidateProgrammeInput, user: Credential) {
    //  candidate
    const candidate: Candidate = await this.candidateService.findOneByChestNo(
      createCandidateProgrammeInput.chestNo,
    );

    if (!candidate) {
      throw new HttpException(
        `Can't find candidate with chest number ${createCandidateProgrammeInput.chestNo}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //  programme
    const programme: Programme = await this.programmeService.findOneByCode(
      createCandidateProgrammeInput.programme_code,
    );

    if (!programme) {
      throw new HttpException(
        `Can't find programme with programme id ${createCandidateProgrammeInput.programme_code}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(
      category => category.name === programme.category?.name,
    );

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to access this category ${programme.category?.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // checking is teamManager have permission to update now
    const Updatable = await this.categorySettingsService.findOne(programme.category.settings.id);


    // already registered
    // initializing the programmes of specified candidate to a variable
    const candidateProgrammes: CandidateProgramme[] = candidate.candidateProgrammes;

    // finding on his programmes
    const isAlreadyDone = candidateProgrammes.find((e: CandidateProgramme) => {
      return e.programme?.name === programme.name;
    });

    if (isAlreadyDone) {
      throw new HttpException(
        `Already Up to date , candidate ${candidate.name} is already in programme ${programme.name} `,
        HttpStatus.BAD_REQUEST,
      );
    }

    // const candidateProgram = await this.candidateProgrammeRepository
    //   .createQueryBuilder('c')
    //   .leftJoinAndSelect('c.candidate', 'candidate')
    //   .leftJoinAndSelect('c.programme', 'programme')
    //   .leftJoinAndSelect('candidate.section', 'section')
    //   .leftJoinAndSelect('candidate.category', 'category')
    //   .leftJoinAndSelect('candidate.team', 'team')
    //   .leftJoinAndSelect('programme.section', 'programmeSection')
    //   .leftJoinAndSelect('programme.category', 'programmeCategory')
    //   .leftJoinAndSelect('programme.skill', 'skill')
    //   .leftJoinAndSelect('category.settings', 'settings')
    //   .leftJoinAndSelect('candidate.candidateProgrammes', 'cp');
    // .where('programme.id = :id', { id: programme.id })
    // .andWhere('candidate.team = :teamId', { teamId: candidate.team?.id })
    // .getCount();

    // candidateProgram[0].forEach((e: CandidateProgramme) => {
    //   console.log(e.candidate.name, e.programme.name);
    // });

    // console.log(candidateProgram);

    this.checkCandideteAccess(candidate, programme);

    // checking the programme is accessible for candidate

    // // checking the category

    const isSameCategory: boolean = candidate.category?.name == programme.category?.name;
    if (!isSameCategory) {
      throw new HttpException(
        `The candidate ${candidate.name} can't participate in programme ${programme.programCode}  ${programme.name} , check the category of candidate`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //  checking the all rules from category settings are regulated

    //  category
    const category_id: number = candidate.category?.id;
    const category: Category = await this.categoryService.findOne(category_id);

    //  settings
    const settings: CategorySettings = category.settings;

    // checking is it covered maximum programme limit

    if (settings.maxProgram) {
      const programmes: CandidateProgramme[] = candidate.candidateProgrammes;
      if (programmes.length >= settings.maxProgram) {
        throw new HttpException(
          'The candidate has covered maximum programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter(
        (e: CandidateProgramme) => {
          return e.programme.type == Type.SINGLE;
        },
      );
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException(
          'The candidate has covered maximum single programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter(
        (e: CandidateProgramme) => {
          return e.programme.type == Type.SINGLE;
        },
      );
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException(
          'The candidate has covered maximum single programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking is it covered maximum group programme limit

    if (settings.maxSingle) {
      const groupPrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter(
        (e: CandidateProgramme) => {
          return e.programme.type == Type.GROUP;
        },
      );
      if (groupPrograms.length >= settings.maxGroup) {
        throw new HttpException(
          'The candidate has covered maximum group programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking the limit of candidates in a team covered
    const team: Team = candidate.team;

    // On single programmes
    if (programme.type == Type.SINGLE) {
      //  candidates of the programme
      const programmeCandidates: CandidateProgramme[] = programme.candidateProgramme;
      // candidates on the team
      // console.log(this.teamCandidates(programmeCandidates, team))

      const onTeamCandidates = this.teamCandidates(programmeCandidates, team);

      if (onTeamCandidates.length >= programme.candidateCount) {
        throw new HttpException(
          `The limit of candidate from a team exceed , you have already ${onTeamCandidates.length} candidates out of ${programme.candidateCount} , please check it`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // On Group programmes
    const groupNumber = createCandidateProgrammeInput.groupNumber;
    if (programme.type == Type.GROUP) {
      //  groups of the programme

      // groupNumber can't exceed maximum count limit
      if (groupNumber > programme.groupCount || groupNumber <= 0) {
        throw new HttpException(
          `A team only have access to have ${programme.groupCount} groups on program ${programme.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      //  candidates of the programme
      const programmeCandidates: CandidateProgramme[] = programme.candidateProgramme;
      // candidates on the team
      const onTeamCandidates = this.teamCandidates(programmeCandidates, team);

      // checking candidates of the  programme in this group is exceed or not
      const programmeCandidatesOfGroup: CandidateProgramme[] = onTeamCandidates.filter(
        async (e: CandidateProgramme) => {
          return e.groupNumber === groupNumber;
        },
      );

      if (programmeCandidatesOfGroup.length >= programme.candidateCount) {
        throw new HttpException(
          `A team only have access to have ${programme.candidateCount} candidates  in a group on program ${programme.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // checking The candidates on each group is exceed the limit or not
      if (onTeamCandidates.length >= programme.groupCount * programme.candidateCount) {
        throw new HttpException(
          `A team only have access to have ${
            programme.candidateCount * programme.groupCount
          } candidates on program ${programme.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    try {
      const newCandidateProgrammeInput = this.candidateProgrammeRepository.create({
        programme,
        candidate,
        groupNumber: createCandidateProgrammeInput.groupNumber,
      });

      return newCandidateProgrammeInput;

      // this.candidateProgrammeRepository.save(newCandidateProgrammeInput);
    } catch (e) {
      throw new HttpException(
        'An Error have when inserting data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }
  }

  checkCandideteAccess(candidate: Candidate, programme: Programme) {
    // checking The candidate is already in the programme
    const candidateProgramme: CandidateProgramme[] = candidate.candidateProgrammes.filter(
      (e: CandidateProgramme) => {
        return e.programme.id == programme.id;
      },
    );
    if (candidateProgramme.length > 0) {
      throw new HttpException('The candidate is already in the programme', HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return this.candidateProgrammeRepository.find({
      relations: ['programme', 'candidate', 'grade', 'position'],
    });
  }

  findOne(id: number) {
    return this.candidateProgrammeRepository.findOne({
      where: { id },
      relations: ['programme', 'candidate', 'grade', 'position'],
    });
  }

  async update(id: number, updateCandidateProgrammeInput: UpdateCandidateProgrammeInput) {
    // checking is The candidateProgramme exist
    const candidateProgramme: CandidateProgramme =
      await this.candidateProgrammeRepository.findOneBy({ id });
    if (!candidateProgramme) {
      throw new HttpException('The candidate programme is not exist', HttpStatus.BAD_REQUEST);
    }
    //  candidate
    const candidate: Candidate = await this.candidateService.findOneByChestNo(
      updateCandidateProgrammeInput.chestNo,
    );

    //  programme
    const programme: Programme = await this.programmeService.findOneByCode(
      updateCandidateProgrammeInput.programme_code,
    );

    // checking the programme is accessible for candidate

    // checking the category

    const isSameCategory: boolean = candidate.category?.name == programme.category?.name;

    if (!isSameCategory) {
      throw new HttpException(
        `The candidate ${candidate.name} can't participate in programme ${programme.programCode}  ${programme.name} , check the category of candidate`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //  checking the all rules from category settings are regulated

    //  category
    const category_id: number = candidate.category?.id;
    const category: Category = await this.categoryService.findOne(category_id);

    //  settings
    const settings: CategorySettings = category.settings;

    // checking is CANDIDATE covered maximum programme limit

    if (settings.maxProgram) {
      const programmes: CandidateProgramme[] = candidate.candidateProgrammes;
      if (programmes.length >= settings.maxProgram) {
        throw new HttpException(
          'The candidate has covered maximum programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter(
        (e: CandidateProgramme) => {
          return e.programme.type == Type.SINGLE;
        },
      );
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException(
          'The candidate has covered maximum single programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter(
        (e: CandidateProgramme) => {
          return e.programme.type == Type.SINGLE;
        },
      );
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException(
          'The candidate has covered maximum single programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking is it covered maximum group programme limit

    if (settings.maxSingle) {
      const groupPrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter(
        (e: CandidateProgramme) => {
          return e.programme.type == Type.GROUP;
        },
      );
      if (groupPrograms.length >= settings.maxGroup) {
        throw new HttpException(
          'The candidate has covered maximum group programme count',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // checking the limit of candidates in a team covered
    const team: Team = candidate.team;
    const groupNumber = updateCandidateProgrammeInput.groupNumber;

    //  checking the team of out dated candidate
    const outDatedCandidate = await this.candidateProgrammeRepository.findOne({
      where: { id },
      relations: ['candidate', 'candidate.team'],
    });

    if (team.name != outDatedCandidate.candidate?.team?.name) {
      throw new HttpException(
        `The candidate ${candidate.name} is not on team ${team.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return this.candidateProgrammeRepository.update(id, {
        candidate,
        groupNumber,
      });
    } catch (e) {
      throw new HttpException(
        'An Error have when inserting data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }
  }

  async remove(id: number) {
    // checking is The candidateProgramme exist
    const candidateProgramme: CandidateProgramme =
      await this.candidateProgrammeRepository.findOneBy({ id });
    if (!candidateProgramme) {
      throw new HttpException('The candidate programme is not exist', HttpStatus.BAD_REQUEST);
    }
    try {
      return this.candidateProgrammeRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        'An error occurred when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }
  }

  async getCandidatesOfProgramme(programCode: string) {
    const programme: Programme = await this.programmeService.findOneByCode(programCode);

    return programme.candidateProgramme;
  }
}

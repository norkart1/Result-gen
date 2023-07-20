import { HttpException, HttpStatus, Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { SectionsService } from 'src/sections/sections.service';
import { TeamsService } from 'src/teams/teams.service';
import { In, Repository } from 'typeorm';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';
import { Candidate } from './entities/candidate.entity';
import { Gender } from './entities/candidate.entity';
import { Category } from 'src/category/entities/category.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Credential } from 'src/credentials/entities/credential.entity';
import { CandidateProgramme } from 'src/candidate-programme/entities/candidate-programme.entity';
import { CandidateProgrammeService } from 'src/candidate-programme/candidate-programme.service';
import { Team } from 'src/teams/entities/team.entity';
import { CreateInput } from './dto/create-input.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate) private candidateRepository: Repository<Candidate>,
    private teamService: TeamsService,
    private categoryService: CategoryService,
    private sectionService: SectionsService,
    private candidateProgrammeService: CandidateProgrammeService,
  ) {}

  //  To create many candidates at a time , Normally using on Excel file upload

  async createMany(createCandidateInputArray: CreateInput, user: Credential) {
    // the final data variable
    var FinalData: Candidate[] = [];
    var allData: {
      adno: number;
      category: Category;
      chestNO: number;
      class: number;
      dob: string;
      name: string;
      gender: Gender;
      team: Team;
    }[] = [];

    // Iterate the values and taking all the individuals

    for (let index = 0; index < createCandidateInputArray.inputs.length; index++) {
      const createCandidateInput = createCandidateInputArray.inputs[index];

      //  checking is category exist

      const category_id = await this.categoryService.findOneByName(createCandidateInput.category);

      if (!category_id) {
        throw new HttpException(
          `Cant find a category named ${createCandidateInput.category}  ,ie: check on Category of ${createCandidateInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      //  checking is team exist

      const team_id = await this.teamService.findOneByName(createCandidateInput.team);

      if (!team_id) {
        throw new HttpException(
          `Cant find a team named ${createCandidateInput.team} ,ie: check on Team of ${createCandidateInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // checking is chessNo already exist
      const candidate = await this.candidateRepository.findOne({
        where: {
          chestNO: createCandidateInput.chestNO,
        },
      });

      if (candidate) {
        throw new HttpException(
          `Candidate with chess no ${createCandidateInput.chestNO} already exists ,ie: check on chessNo of ${createCandidateInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // checking is chestNo already exist in the array

      const chestNoExists = allData.some(data => data.chestNO === createCandidateInput.chestNO);

      if (chestNoExists) {
        throw new HttpException(
          `Multiple candidates have same chest no ${createCandidateInput.chestNO} ,ie: check on chestNo of ${createCandidateInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      allData.push({
        adno: createCandidateInput.adno,
        category: category_id,
        chestNO: createCandidateInput.chestNO,
        class: createCandidateInput.class,
        dob: createCandidateInput.dob,
        name: createCandidateInput.name,
        gender : createCandidateInput.gender,
        team : team_id
      } );
    }

    // looping the values

    try {

      // checking all candidates are checked

      if(allData.length !== createCandidateInputArray.inputs.length){
        throw new HttpException(
          `Some candidates are not eligible to create ,ie: check on candidates`,
          HttpStatus.BAD_REQUEST,
        );
      }


      for (let index = 0; index < allData.length; index++) {
        const data = allData[index];

        // creating a instance of Candidate
        const input = new Candidate();

        // updating Value to candidate
        input.adno = data.adno;
        input.category = data.category;
        input.chestNO = data.chestNO;
        input.class = data.class;
        input.dob = data.dob;
        input.gender = data.gender;
        input.name = data.name;
        input.team = data.team;

        let saveData = await this.candidateRepository.save(input);

        FinalData.push(saveData);
      }

      return FinalData;
    } catch (e) {
      throw new HttpException(
        'An Error have when inserting data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  // create a single candidate
  async create(createCandidateInput: CreateCandidateInput, user: Credential): Promise<Candidate> {
    //  checking is category exist

    const category_id = await this.categoryService.findOneByName(createCandidateInput.category);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${createCandidateInput.category}  ,ie: check on Category of ${createCandidateInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(category => category.name === category_id.name);

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to access the category ${category_id.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // --------------------
    // checking .........
    // --------------------

    //  checking is team exist

    const team_id = await this.teamService.findOneByName(createCandidateInput.team);

    if (!team_id) {
      throw new HttpException(
        `Cant find a team named ${createCandidateInput.team} ,ie: check on Team of ${createCandidateInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // checking is chessNo already exist
    const candidate = await this.candidateRepository.findOne({
      where: {
        chestNO: createCandidateInput.chestNO,
      },
    });

    if (candidate) {
      throw new HttpException(
        `Candidate with chess no ${createCandidateInput.chestNO} already exists ,ie: check on chessNo of ${createCandidateInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // creating a instance of Candidate
      const input = new Candidate();

      // updating Value to candidate
      input.adno = createCandidateInput.adno;
      input.category = category_id;
      input.chestNO = createCandidateInput.chestNO;
      input.class = createCandidateInput.class;
      input.dob = createCandidateInput.dob;
      input.gender = createCandidateInput.gender;
      input.name = createCandidateInput.name;
      input.team = team_id;

      return this.candidateRepository.save(input);
    } catch (e) {
      throw new HttpException(
        'An Error have when inserting data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findAll() {
    try {
      return this.candidateRepository.find({
        relations: ['category', 'team', 'candidateProgrammes', 'candidateProgrammesOfGroup'],
      });
    } catch (e) {
      throw new HttpException(
        'An Error have when finding candidates ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findByCategories(categories: string[]) {
    try {
      const candidates = this.candidateRepository.find({
        where: {
          category: In(categories),
        },
        relations: ['category', 'team', 'candidateProgrammes'],
      });

      if (!candidates) {
        throw new HttpException(
          `Cant find candidates with categories ${categories} `,
          HttpStatus.BAD_REQUEST,
        );
      }

      return candidates;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: e });
    }
  }

  async findOne(id: number) {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: {
          id,
        },
        relations: ['category', 'team', 'candidateProgrammes'],
      });

      if (!candidate) {
        throw new HttpException(`Cant find candidate with id ${id} `, HttpStatus.BAD_REQUEST);
      }
      await this.candidateProgrammeService.getCandidatesOfGroupOfCandidate(candidate.chestNO);
      return candidate;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: e });
    }
  }

  async findOneByChestNo(chestNO: number) {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: {
          chestNO,
        },
        relations: ['category', 'team', 'candidateProgrammes'],
      });

      if (!candidate) {
        throw new HttpException(
          `Cant find candidate with chest no ${chestNO} `,
          HttpStatus.BAD_REQUEST,
        );
      }

      return candidate;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: e });
    }
  }

  // check is candidate in a programme

  async findOneByChestNoAndProgrammeId(chestNO: number, programmeCode: string) {
    // checking is candidate exist

    const candidate = await this.candidateRepository.findOne({
      where: {
        chestNO,
      },
      relations: ['candidateProgrammes'],
    });

    if (!candidate) {
      throw new HttpException(`Cant find candidate with name ${chestNO} `, HttpStatus.BAD_REQUEST);
    }

    // checking is candidate in programme

    const candidateProgramme = candidate.candidateProgrammes?.find(
      candidateProgramme => candidateProgramme.programme?.programCode === programmeCode,
    );

    return candidateProgramme;
  }

  // Update data

  async update(id: number, updateCandidateInput: UpdateCandidateInput, user: Credential) {
    // --------------------
    // checking .........
    // --------------------
    //  checking is category exist

    const category_id = await this.categoryService.findOneByName(updateCandidateInput.category);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${updateCandidateInput.category}  ,ie: check on Category of ${updateCandidateInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(category => category.name === category_id.name);

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to access the category ${category_id.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // checking is candidate exist

    const candidate = await this.candidateRepository.findOneBy({ id });

    if (!candidate) {
      throw new HttpException(
        `Cant find a candidate named ${updateCandidateInput.name}}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //  checking is team exist

    const team_id = await this.teamService.findOneByName(updateCandidateInput.team);

    if (!team_id) {
      throw new HttpException(
        `Cant find a team named ${updateCandidateInput.team} ,ie: check on Team of ${updateCandidateInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // creating a instance of Candidate
      const input = new Candidate();

      // updating Value to candidate
      input.adno = updateCandidateInput.adno;
      input.category = category_id;
      input.chestNO = updateCandidateInput.chestNO;
      input.class = updateCandidateInput.class;
      input.dob = updateCandidateInput.dob;
      input.gender = updateCandidateInput.gender;
      input.name = updateCandidateInput.name;
      input.team = team_id;

      return this.candidateRepository.update(id, input);
      // return this.candidateRepository.save(input)
    } catch (e) {
      throw new HttpException(
        'An Error have when updating data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async remove(id: number, user: Credential) {
    // --------------------
    // checking .........
    // --------------------

    // checking is candidate exist

    const candidate = await this.findOne(id);

    const category_id = await this.categoryService.findOneByName(candidate?.category?.name);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${candidate?.category?.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(category => category.name === category_id.name);

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to access the category ${category_id.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!candidate) {
      throw new HttpException(`Cant find a candidate to delete`, HttpStatus.BAD_REQUEST);
    }

    try {
      return this.candidateRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }
}

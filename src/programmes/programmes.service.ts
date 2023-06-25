import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProgrammeInput } from './dto/create-programme.input';
import { UpdateProgrammeInput } from './dto/update-programme.input';
import { Mode, Programme, Type } from './entities/programme.entity';
import { CategoryService } from 'src/category/category.service';
import { SectionsService } from 'src/sections/sections.service';
import { SkillService } from 'src/skill/skill.service';
import { CreateSchedule } from './dto/create-schedule.dto';
import { updateSchedule } from './dto/update-schedule.dto';
import { Credential } from 'src/credentials/entities/credential.entity';
import { DetailsService } from 'src/details/details.service';

@Injectable()
export class ProgrammesService {
  constructor(
    @InjectRepository(Programme) private programmeRepository: Repository<Programme>,
    private skillService: SkillService,
    private categoryService: CategoryService,
    private sectionService: SectionsService,
    private detailsService: DetailsService,
  ) {}

  //  To create many Programmes at a time , usually using on Excel file upload

  async createMany(createProgrammeInputArray: CreateProgrammeInput[], user: Credential) {
    // the final data variable
    var FinalData: Programme[] = [];

    // Iterate the values and taking all the individuals

    for (let index = 0; index < createProgrammeInputArray.length; index++) {
      const createProgrammeInput = createProgrammeInputArray[index];

      //  checking is category exist

      const category_id = await this.categoryService.findOneByName(createProgrammeInput.category);

      if (!category_id) {
        throw new HttpException(
          `Cant find a category named ${createProgrammeInput.category}  ,ie: check on Category of ${createProgrammeInput.name}`,
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

      // const IS_SKILL_REQUIRED = (await this.detailsService.findIt()).isMediaHave

      //  checking is skill exist

      const skill_id = await this.skillService.findOneByName(createProgrammeInput.skill);

      if (!skill_id) {
        throw new HttpException(
          `Cant find a skill named ${createProgrammeInput.skill} ,ie: check on skill of ${createProgrammeInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // checking is programmeCode already exist
      const Programme = await this.programmeRepository.findOne({
        where: {
          programCode: createProgrammeInput.programCode,
        },
      });

      if (Programme) {
        throw new HttpException(
          `Programme with programme code ${createProgrammeInput.programCode} already exists ,ie: check on programme code of ${createProgrammeInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // validating is duration int

      if (isNaN(createProgrammeInput.duration)) {
        throw new HttpException(
          `Duration must be a number  ,ie: check on Duration of ${createProgrammeInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // validating is candidate Count int

      if (isNaN(createProgrammeInput.candidateCount)) {
        throw new HttpException(
          `candidate Count must be a number  ,ie: check on candidateCount of ${createProgrammeInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // validating is there conceptnote

      if (!createProgrammeInput.conceptNote) {
        throw new HttpException(
          `Concept note is required ,ie: check on concept Note of  ${createProgrammeInput.programCode} ${createProgrammeInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // validating type by Type Enum if it is not listed in Gender Enum throw a exception

      if (!Object.values(Type).includes(createProgrammeInput.type)) {
        throw new HttpException(
          `Invalid Type of Type  ,ie: check on Type of ${createProgrammeInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // validating mode by Mode Enum if it is not listed in Gender Enum throw a exception

      if (!Object.values(Mode).includes(createProgrammeInput.mode)) {
        throw new HttpException(
          `Invalid Type of Mode  ,ie: check on mode of ${createProgrammeInput.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // --------------------
    // After all validation
    // --------------------

    // looping the values

    try {
      for (let index = 0; index < createProgrammeInputArray.length; index++) {
        const data = createProgrammeInputArray[index];

        // Double checking

        //  checking is skill exist

        const skill_id = await this.skillService.findOneByName(data.skill);

        if (!skill_id) {
          throw new HttpException(
            `Cant find a skill named ${data.skill} ,ie: check on Skill of ${data.name}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        //  checking is category exist

        const category_id = await this.categoryService.findOneByName(data.category);

        if (!category_id) {
          throw new HttpException(
            `Cant find a category named ${data.category}  ,ie: check on Category of ${data.name}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // creating a instance of Programme
        const input = new Programme();

        // updating Value to Programme
        input.candidateCount = data.candidateCount;
        input.category = category_id;
        input.duration = data.duration;
        input.mode = data.mode;
        input.name = data.name;
        input.programCode = data.programCode;
        input.skill = skill_id;
        input.type = data.type;
        input.venue = data.venue;
        input.groupCount = data.groupCount;
        input.conceptNote = data.conceptNote;

        let saveData = await this.programmeRepository.save(input);

        FinalData.push(saveData);
      }

      console.log(FinalData);

      return FinalData;
    } catch (e) {
      console.log(e);

      throw new HttpException(
        'An Error have when inserting data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async create(createProgrammeInput: CreateProgrammeInput, user: Credential) {
    // checking the programme is already exist
    const programme = await this.programmeRepository.findOne({
      where: {
        programCode: createProgrammeInput.programCode,
      },
    });

    if (programme) {
      throw new HttpException(
        'Programme with this programme code already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    //  checking is category exist

    const category_id = await this.categoryService.findOneByName(createProgrammeInput.category);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${createProgrammeInput.category}  ,ie: check on Category of ${createProgrammeInput.name}`,
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

    //  checking is skill exist

    const skill_id = await this.skillService.findOneByName(createProgrammeInput.skill);

    if (!skill_id) {
      throw new HttpException(
        `Cant find a skill named ${createProgrammeInput.skill} ,ie: check on skill of ${createProgrammeInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // creating a instance of Programme
      const input = new Programme();

      // updating Value to Programme
      input.candidateCount = createProgrammeInput.candidateCount;
      input.category = category_id;
      input.duration = createProgrammeInput.duration;
      input.mode = createProgrammeInput.mode;
      input.name = createProgrammeInput.name;
      input.programCode = createProgrammeInput.programCode;
      input.skill = skill_id;
      input.type = createProgrammeInput.type;
      input.venue = createProgrammeInput.venue || null;
      input.groupCount = createProgrammeInput.groupCount || null;
      input.conceptNote = createProgrammeInput.conceptNote;

      return await this.programmeRepository.save(input);
    } catch (e) {
      console.log(e);

      throw new HttpException(
        'An Error have when inserting data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    try {
      return this.programmeRepository.find({
        relations: ['category', 'skill', 'candidateProgramme'],
      });
    } catch {
      throw new HttpException('An Error have when finding data ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    try {
      return this.programmeRepository.findOne({
        where: { id },
        relations: ['category', 'skill', 'candidateProgramme'],
      });
    } catch {
      throw new HttpException('An Error have when finding data ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByCode(programCode: string) {
    try {
      return this.programmeRepository.findOne({
        where: { programCode },
        relations: [
          'category',
          'section',
          'skill',
          'candidateProgramme',
          'candidateProgramme.candidate',
          'candidateProgramme.candidate.team',
        ],
      });
    } catch (e) {
      throw new HttpException('An Error have when finding data ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findByCaterories(categories: string[]) {
    try {
      return this.programmeRepository.find({
        where: {
          category: In(categories),
        },
        relations: ['category', 'skill', 'candidateProgramme'],
      });
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async update(id: number, updateProgrammeInput: UpdateProgrammeInput, user: Credential) {
    //  checking is category exist

    const category_id = await this.categoryService.findOneByName(updateProgrammeInput.category);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${updateProgrammeInput.category}  ,ie: check on Category of ${updateProgrammeInput.name}`,
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

    const programme = await this.programmeRepository.findOneBy({ id });

    if (!programme) {
      throw new HttpException(`Cant find a programme to update`, HttpStatus.BAD_REQUEST);
    }

    //  checking is skill exist

    const skill_id = await this.skillService.findOneByName(updateProgrammeInput.skill);

    if (!skill_id) {
      throw new HttpException(
        `Cant find a skill named ${updateProgrammeInput.skill} ,ie: check on skill of ${updateProgrammeInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // creating a instance of Programme
      const input = new Programme();

      // updating Value to Programme
      input.candidateCount = updateProgrammeInput.candidateCount;
      input.category = category_id;
      input.duration = updateProgrammeInput.duration;
      input.mode = updateProgrammeInput.mode;
      input.name = updateProgrammeInput.name;
      input.programCode = updateProgrammeInput.programCode;
      input.skill = skill_id;
      input.type = updateProgrammeInput.type;
      input.venue = updateProgrammeInput.venue;
      input.groupCount = updateProgrammeInput.groupCount;
      input.conceptNote = updateProgrammeInput.conceptNote;

      return this.programmeRepository.update(id, input);
    } catch {
      throw new HttpException(
        'An Error have when updating data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number, user: Credential) {
    // checking is candidate exist

    const programme = await this.findOne(id);

    const category_id = await this.categoryService.findOneByName(programme?.category?.name);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${programme?.category?.name}  ,ie: check on Category of ${programme?.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(category => category.name === category_id.name);

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to accsess the category ${category_id.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!programme) {
      throw new HttpException(`Cant find a programme to delete`, HttpStatus.BAD_REQUEST);
    }

    try {
      return this.programmeRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async setManySchedule(scheduleData: CreateSchedule[], user: Credential) {
    // checking the data there
    // iterate the array
    for (let index = 0; index < scheduleData.length; index++) {
      const data: CreateSchedule = scheduleData[index];

      const { code, date, venue } = data;

      // checking the code is correct
      const programme: Programme = await this.findOneByCode(code);

      const category_id = await this.categoryService.findOneByName(programme?.category?.name);

      if (!category_id) {
        throw new HttpException(
          `Cant find a category named ${programme?.category?.name}`,
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

      if (!programme) {
        throw new HttpException(`Cant find a programme with code ${code}`, HttpStatus.BAD_REQUEST);
      }

      // validating the date

      const isDate = this.isInputDataValid(date);

      if (!isDate) {
        throw new HttpException(`Date is not valid`, HttpStatus.BAD_REQUEST);
      }

      // checking is venue entered it is not essential but if entered it must be a number

      if (venue) {
        if (isNaN(venue)) {
          throw new HttpException(`Venue must be a number`, HttpStatus.BAD_REQUEST);
        }
      }
    }

    // -------------------
    // INSERTING DATA TO DATABASE
    // --------------------

    for (let index = 0; index < scheduleData.length; index++) {
      const data: CreateSchedule = scheduleData[index];

      const { code, date, venue } = data;

      // checking the code is correct
      const programme: Programme = await this.findOneByCode(code);

      // updating the programme by adding date and venue

      programme.date = date;
      programme.venue = venue;

      return this.programmeRepository.save(programme);
    }
  }

  isInputDataValid(input: any): boolean {
    const timestamp = input.getTime();
    return !isNaN(timestamp);
  }

  async setSchedule(scheduleData: CreateSchedule, user: Credential) {
    const { code, date, venue } = scheduleData;

    // checking the code is correct
    const programme: Programme = await this.findOneByCode(code);

    if (!programme) {
      throw new HttpException(`Cant find a programme with code ${code}`, HttpStatus.BAD_REQUEST);
    }

    const category_id = await this.categoryService.findOneByName(programme?.category?.name);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${programme?.category?.name}`,
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

    // validating the date

    const isDate = this.isInputDataValid(date);

    if (!isDate) {
      throw new HttpException(`Date is not valid`, HttpStatus.BAD_REQUEST);
    }

    // checking is venue entered it is not essential but if entered it must be a number

    if (venue) {
      if (isNaN(venue)) {
        throw new HttpException(`Venue must be a number`, HttpStatus.BAD_REQUEST);
      }
    }

    // -------------------
    // INSERTING DATA TO DATABASE
    // --------------------

    // updating the programme by adding date and venue

    programme.date = date;
    programme.venue = venue;

    return this.programmeRepository.save(programme);
  }

  async removeSchedule(programCode: string, user: Credential) {
    // checking the code is correct
    const programme: Programme = await this.findOneByCode(programCode);

    if (!programme) {
      throw new HttpException(
        `Cant find a programme with code ${programCode}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const category_id = await this.categoryService.findOneByName(programme?.category?.name);

    if (!category_id) {
      throw new HttpException(
        `Cant find a category named ${programme?.category?.name}`,
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

    try {
      return this.programmeRepository.query(
        `UPDATE programme SET date = null , venue = null  WHERE program_code = "${programCode}" `,
      );
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async enterResult(programCode: string) {
    // checking the code is correct
    const programme: Programme = await this.findOneByCode(programCode);

    if (!programme) {
      throw new HttpException(
        `Cant find a programme with code ${programCode}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return this.programmeRepository.query(
        `UPDATE programme SET result_entered = true WHERE program_code = "${programCode}" `,
      );
    } catch (e) {
      throw new HttpException(
        'An Error have when updating data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async removeResult(programCode: string) {
    // checking the code is correct
    const programme: Programme = await this.findOneByCode(programCode);

    if (!programme) {
      throw new HttpException(
        `Cant find a programme with code ${programCode}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return this.programmeRepository.query(
        `UPDATE programme SET result_entered = false WHERE program_code = "${programCode}" `,
      );
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async publishResult(programCode: string) {
    // checking the code is correct
    const programme: Programme = await this.findOneByCode(programCode);

    if (!programme) {
      throw new HttpException(
        `Cant find a programme with code ${programCode}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return this.programmeRepository.query(
        `UPDATE programme SET result_published = true WHERE program_code = "${programCode}" `,
      );
    } catch (e) {
      throw new HttpException(
        'An Error have when updating data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async removePublishedResult(programCode: string) {
    // checking the code is correct
    const programme: Programme = await this.findOneByCode(programCode);

    if (!programme) {
      throw new HttpException(
        `Cant find a programme with code ${programCode}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return this.programmeRepository.query(
        `UPDATE programme SET result_published = false WHERE program_code = "${programCode}"`,
      );
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }
}

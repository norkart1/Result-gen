import { HttpException, HttpStatus, Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { SectionsService } from 'src/sections/sections.service';
import { TeamsService } from 'src/teams/teams.service';
import { Repository } from 'typeorm';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';
import { Candidate } from './entities/candidate.entity';
import { Gender } from './entities/candidate.entity';
import { Category } from 'src/category/entities/category.entity';
import { Section } from 'src/sections/entities/section.entity';

@Injectable()
export class CandidatesService {

  constructor(
    @InjectRepository(Candidate) private candidateRepository: Repository<Candidate>,
    private teamService: TeamsService,
    private categoryService: CategoryService,
    private sectionService: SectionsService
  ) { }



  //  To create many candidates at a time usually using on Excel file upload

  async createMany(createCandidateInputArray: CreateCandidateInput[]) {

    // the final data variable
    var FinalData: CreateCandidateInput[] = [];

    // Iterate the values and taking all the individuals

    for (let index = 0; index < createCandidateInputArray.length; index++) {
      const createCandidateInput = createCandidateInputArray[index];

      // -------------------- 
      // checking .........
      // --------------------

      //  checking is team exist

      const team_id = await this.teamService.findOneByName(createCandidateInput.team)

      if (!team_id) {
        throw new HttpException(`Cant find a team named ${createCandidateInput.team} ,ie: check on Team of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST)
      }

      //  checking is category exist

      const category_id = await this.categoryService.findOneByName(createCandidateInput.category)

      if (!category_id) {
        throw new HttpException(`Cant find a category named ${createCandidateInput.category}  ,ie: check on Category of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST)
      }

      //  checking is section exist

      const section_id = await this.sectionService.findOneByName(createCandidateInput.section)

      if (!section_id) {
        throw new HttpException(`Cant find a section named ${createCandidateInput.section}  ,ie: check on Section of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST)
      }

      // checking is chessNo already exist
      const candidate = await this.candidateRepository.findOne({
        where: {
          chestNO: createCandidateInput.chestNO
        },
      })

      if (candidate) {
        throw new HttpException(`Candidate with chess no ${createCandidateInput.chestNO} already exists ,ie: check on chessNo of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST);
      }

      // --------------------
      // validating .........
      // --------------------

      // validating is class int

      if (isNaN(createCandidateInput.class)) {
        throw new HttpException(`Class must be a number  ,ie: check on class of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST);
      }

      // validating is adno int

      if (isNaN(createCandidateInput.adno)) {
        throw new HttpException(`Admission number must be a number  ,ie: check on Adm of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST);
      }

      // validating is chess no int

      if (isNaN(createCandidateInput.chestNO)) {
console.log(createCandidateInput.chestNO);

        throw new HttpException(`Chest number must be a number  ,ie: check on chessNo of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST);
      }

      // validating gender by Gender Enum if it is not listed in Gender Enum throw a exception

      if (!Object.values(Gender).includes(createCandidateInput.gender)) {
        throw new HttpException(`Invalid Type of Gender  ,ie: check on Gender of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST)
      }

    }


    // --------------------
    // After all validation 
    // --------------------


    // looping the values

    try {

      // createCandidateInputArray.forEach(async (data, i) => {

      for (let index = 0; index < createCandidateInputArray.length; index++) {
        const data = createCandidateInputArray[index];


        // Double checking

        //  checking is team exist

        const team_id = await this.teamService.findOneByName(data.team)

        if (!team_id) {
          throw new HttpException(`Cant find a team named ${data.team} ,ie: check on Team of ${data.name}`, HttpStatus.BAD_REQUEST)
        }

        //  checking is category exist

        const category_id :Category= await this.categoryService.findOneByName(data.category)

        if (!category_id) {
          throw new HttpException(`Cant find a category named ${data.category}  ,ie: check on Category of ${data.name}`, HttpStatus.BAD_REQUEST)
        }

        console.log('category   ' + category_id.name  + ' original  ' + data.category);
        

        //  checking is section exist

        const section_id :Section = await this.sectionService.findOneByName(data.section)

        if (!section_id) {
          throw new HttpException(`Cant find a section named ${data.section}  ,ie: check on Section of ${data.name}`, HttpStatus.BAD_REQUEST)
        }

        console.log('section_id   ' + section_id.name + ' original  ' + data.section);

        // creating a instance of Candidate
        const input = new Candidate;

        // updating Value to candidate
        input.adno = data.adno;
        input.category = category_id;
        input.chestNO = data.chestNO;
        input.class = data.class;
        input.dob = data.dob;
        input.gender = data.gender;
        input.name = data.name;
        input.section = section_id;
        input.team = team_id;

        let saveData = await this.candidateRepository.save(input)

        FinalData.push(data)
      }

      console.log(FinalData);

      return {
        status: "success",
        data: FinalData
      }

    } catch (e) {

      throw new HttpException("An Error have when inserting data , please check the all required fields are filled ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })

    }


  }


  // create a single candidate
  async create(createCandidateInput: CreateCandidateInput) {

    // --------------------
    // checking .........
    // --------------------

    //  checking is team exist

    const team_id = await this.teamService.findOneByName(createCandidateInput.team)

    if (!team_id) {
      throw new HttpException(`Cant find a team named ${createCandidateInput.team} ,ie: check on Team of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST)
    }

    //  checking is category exist

    const category_id = await this.categoryService.findOneByName(createCandidateInput.category)

    if (!category_id) {
      throw new HttpException(`Cant find a category named ${createCandidateInput.category}  ,ie: check on Category of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST)
    }

    //  checking is section exist

    const section_id = await this.sectionService.findOneByName(createCandidateInput.section)

    if (!section_id) {
      throw new HttpException(`Cant find a section named ${createCandidateInput.section}  ,ie: check on Section of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST)
    }

    // checking is chessNo already exist
    const candidate = await this.candidateRepository.findOne({
      where: {
        chestNO: createCandidateInput.chestNO
      },
    })

    if (candidate) {
      throw new HttpException(`Candidate with chess no ${createCandidateInput.chestNO} already exists ,ie: check on chessNo of ${createCandidateInput.name}`, HttpStatus.BAD_REQUEST);
    }

    try {
      // creating a instance of Candidate
      const input = new Candidate;

      // updating Value to candidate
      input.adno = createCandidateInput.adno;
      input.category = category_id;
      input.chestNO = createCandidateInput.chestNO;
      input.class = createCandidateInput.class;
      input.dob = createCandidateInput.dob;
      input.gender = createCandidateInput.gender;
      input.name = createCandidateInput.name;
      input.section = section_id;
      input.team = team_id;

      return this.candidateRepository.save(input)

    } catch (e) {
      throw new HttpException("An Error have when inserting data , please check the all required fields are filled ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }


  findAll() {
    try {

      return this.candidateRepository.find({ relations: ['category', 'category.candidates', 'section', 'section.candidates', 'team', 'team.candidates', 'candidateProgrammes', 'candidateProgrammes.programme'] });
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  async findOne(id: number) {
    try {
      const candidate = await this.candidateRepository.findOne({
        where: {
          id
        },
        relations: ['category', 'category.candidates', 'section', 'section.candidates', 'team', 'team.candidates', 'candidateProgrammes', 'candidateProgrammes.programme']
      });

      if (!candidate) {
        throw new HttpException(`Cant find candidate with id ${id} `, HttpStatus.BAD_REQUEST);
      }

      return candidate;
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  async findOneByChestNo(chestNO: number) {

    try {
      const candidate = await this.candidateRepository.findOne({
        where: {
          chestNO
        },
        relations: ['category', 'category.candidates', 'section', 'section.candidates', 'team', 'team.candidates', 'candidateProgrammes', 'candidateProgrammes.programme']
      });

      if (!candidate) {
        throw new HttpException(`Cant find candidate with name ${chestNO} `, HttpStatus.BAD_REQUEST);
      }

      return candidate;

    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }



  // Update data

  async update(id: number, updateCandidateInput: UpdateCandidateInput) {

    // --------------------
    // checking .........
    // --------------------

    // checking is candidate exist

    const candidate = await this.candidateRepository.findOneBy({ id })

    if (!candidate) {
      throw new HttpException(`Cant find a candidate named ${updateCandidateInput.name}}`, HttpStatus.BAD_REQUEST)
    }

    //  checking is team exist

    const team_id = await this.teamService.findOneByName(updateCandidateInput.team)

    if (!team_id) {
      throw new HttpException(`Cant find a team named ${updateCandidateInput.team} ,ie: check on Team of ${updateCandidateInput.name}`, HttpStatus.BAD_REQUEST)
    }

    //  checking is category exist

    const category_id = await this.categoryService.findOneByName(updateCandidateInput.category)

    if (!category_id) {
      throw new HttpException(`Cant find a category named ${updateCandidateInput.category}  ,ie: check on Category of ${updateCandidateInput.name}`, HttpStatus.BAD_REQUEST)
    }

    //  checking is section exist

    const section_id = await this.sectionService.findOneByName(updateCandidateInput.section)

    if (!section_id) {
      throw new HttpException(`Cant find a section named ${updateCandidateInput.section}  ,ie: check on Section of ${updateCandidateInput.name}`, HttpStatus.BAD_REQUEST)
    }

    try {
      // creating a instance of Candidate
      const input = new Candidate;

      // updating Value to candidate
      input.adno = updateCandidateInput.adno;
      input.category = category_id;
      input.chestNO = updateCandidateInput.chestNO;
      input.class = updateCandidateInput.class;
      input.dob = updateCandidateInput.dob;
      input.gender = updateCandidateInput.gender;
      input.name = updateCandidateInput.name;
      input.section = section_id;
      input.team = team_id;

      return this.candidateRepository.update(id, input);
      // return this.candidateRepository.save(input)

    } catch (e) {
      throw new HttpException("An Error have when updating data , please check the all required fields are filled ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }


  }

  async remove(id: number) {
    // --------------------
    // checking .........
    // --------------------

    // checking is candidate exist

    const candidate = await this.candidateRepository.findOneBy({ id })

    if (!candidate) {
      throw new HttpException(`Cant find a candidate to delete`, HttpStatus.BAD_REQUEST)
    }

    try {
      return this.candidateRepository.delete(id);
    } catch (e) {
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }


  // check candidates programme

  async checkProgrammeOfCandidate(candidate: Candidate) {

    // check this candidate's candidateProgrammes

    // this.candidateRepository.findOne({})
  }
}

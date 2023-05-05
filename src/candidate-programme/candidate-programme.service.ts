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
import { AddResult } from './dto/add-result.dto';
import { GradesService } from 'src/grades/grades.service';
import { Grade } from 'src/grades/entities/grade.entity';
import { PositionService } from 'src/position/position.service';
import { Position } from 'src/position/entities/position.entity';

@Injectable()
export class CandidateProgrammeService {


  constructor(@InjectRepository(CandidateProgramme) private candidateProgrammeRepository: Repository<CandidateProgramme>,
    private readonly candidateService: CandidatesService,
    private readonly programmeService: ProgrammesService,
    private readonly categoryService: CategoryService,
    private readonly gradeService: GradesService,
    private readonly positionService: PositionService
  ) { }


  teamCandidates(candidateProgrammes: CandidateProgramme[], team: Team) {
    return candidateProgrammes.filter((e: CandidateProgramme) => {
      return e.candidate.team.name == team.name
    })
  }


  async create(createCandidateProgrammeInput: CreateCandidateProgrammeInput) {

    //  candidate
    const candidate: Candidate = await this.candidateService.findOneByChestNo(createCandidateProgrammeInput.chestNo)

    //  programme
    const programme: Programme = await this.programmeService.findOneByCode(createCandidateProgrammeInput.programme_code)

    // checking the programme is accessible for candidate

    // checking the section

    const isSameSection: boolean = candidate.section?.name == programme.section?.name


    // console.log(`is samesection ${isSameSection}  and ${candidate.section?.name} and ${programme.section?.name}`);

    if (!isSameSection) {
      throw new HttpException(`the candidate ${candidate.name} can't participate in programme ${programme.programCode}  ${programme.name} , check the section of candidate`, HttpStatus.BAD_REQUEST)
    }

    // checking the category

    const isSameCategory: boolean = candidate.category?.name == programme.category?.name
    // console.log(`is samesection ${isSameCategory}  and ${candidate.category?.name} and ${programme.category?.name}`);

    if (!isSameCategory) {
      throw new HttpException(`the candidate ${candidate.name} can't participate in programme ${programme.programCode}  ${programme.name} , check the category of candidate`, HttpStatus.BAD_REQUEST)
    }

    // -------------------------------
    // -------------------------------
    // -------------------------------

    //  checking the all rules from category settings are regulated

    //  category
    const category_id: number = candidate.category?.id
    const category: Category = await this.categoryService.findOne(category_id);



    //  settings
    const settings: CategorySettings = category.settings;


    // checking is it covered maximum programme limit

    if (settings.maxProgram) {
      const programmes: CandidateProgramme[] = candidate.candidateProgrammes
      if (programmes.length >= settings.maxProgram) {
        throw new HttpException("THe candidate has covered maximum programme count", HttpStatus.BAD_REQUEST)
      }
    }

    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter((e: CandidateProgramme) => {
        return e.programme.type == Type.SINGLE
      })
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException("THe candidate has covered maximum single programme count", HttpStatus.BAD_REQUEST)
      }
    }




    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter((e: CandidateProgramme) => {
        return e.programme.type == Type.SINGLE
      })
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException("THe candidate has covered maximum single programme count", HttpStatus.BAD_REQUEST)
      }
    }

    // checking is it covered maximum group programme limit

    if (settings.maxSingle) {
      const groupPrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter((e: CandidateProgramme) => {
        return e.programme.type == Type.GROUP
      })
      if (groupPrograms.length >= settings.maxGroup) {
        throw new HttpException("THe candidate has covered maximum group programme count", HttpStatus.BAD_REQUEST)
      }
    }

    // -------------------------------
    // -------------------------------
    // -------------------------------

    // checking the limit of candidates in a team covered
    const team: Team = candidate.team;


    // On single programmes
    if (programme.type == Type.SINGLE) {
      //  candidates of the programme
      const programmeCandidates: CandidateProgramme[] = programme.candidateProgramme;
      // candidates on the team


      const onTeamCandidates = this.teamCandidates(programmeCandidates, team)

      if (onTeamCandidates.length >= programme.candidateCount) {
        throw new HttpException(`The limit of candidate from a team exceed , you have already ${onTeamCandidates.length} candidates out of ${programme.candidateCount} , please check it`, HttpStatus.BAD_REQUEST)
      }
    }



    // On Group programmes
    const groupNumber = createCandidateProgrammeInput.groupNumber
    if (programme.type == Type.GROUP) {
      //  groups of the programme

      // groupNumber can't exceed maximum count limit
      if (groupNumber > programme.groupCount || groupNumber <= 0) {
        throw new HttpException(`A team only have access to have ${programme.groupCount} groups on program ${programme.name}`, HttpStatus.BAD_REQUEST)
      }
      //  candidates of the programme
      const programmeCandidates: CandidateProgramme[] = programme.candidateProgramme;
      // candidates on the team
      const onTeamCandidates = this.teamCandidates(programmeCandidates, team)

      // checking candidates of the  programme in this group is exceed or not
      const programmeCandidatesOfGroup: CandidateProgramme[] = onTeamCandidates.filter(async (e: CandidateProgramme) => {
        return e.groupNumber === groupNumber
      })

      if (programmeCandidatesOfGroup.length >= programme.candidateCount) {
        throw new HttpException(`A team only have access to have ${programme.candidateCount} candidates  in a group on program ${programme.name}`, HttpStatus.BAD_REQUEST)
      }

      // checking the candidates on each group is exceed the limit or not
      if (onTeamCandidates.length >= (programme.groupCount * programme.candidateCount)) {
        throw new HttpException(`A team only have access to have ${programme.candidateCount * programme.groupCount} candidates on program ${programme.name}`, HttpStatus.BAD_REQUEST)
      }


    }
    try {
      const newCandidateProgrammeInput = this.candidateProgrammeRepository.create({
        programme,
        candidate,
        groupNumber
      })

      return this.candidateProgrammeRepository.save(newCandidateProgrammeInput)
    } catch (e) {
      throw new HttpException("An Error have when inserting data , please check the all required fields are filled ", HttpStatus.INTERNAL_SERVER_ERROR, e)
    }

  }



  findAll() {
    return this.candidateProgrammeRepository.find({ relations: ['programme', 'candidate', 'grade', 'position'] });
  }

  findOne(id: number) {
    return this.candidateProgrammeRepository.findOne({
      where: { id },
      relations: ['programme', 'candidate', 'grade', 'position']
    })
  }

  async update(id: number, updateCandidateProgrammeInput: UpdateCandidateProgrammeInput) {
    // checking is the candidateProgramme exist
    const candidateProgramme: CandidateProgramme = await this.candidateProgrammeRepository.findOneBy({ id })
    if (!candidateProgramme) {
      throw new HttpException("The candidate programme is not exist", HttpStatus.BAD_REQUEST)
    }
    //  candidate
    const candidate: Candidate = await this.candidateService.findOneByChestNo(updateCandidateProgrammeInput.chestNo)

    //  programme
    const programme: Programme = await this.programmeService.findOneByCode(updateCandidateProgrammeInput.programme_code)

    // checking the programme is accessible for candidate

    // checking the section

    const isSameSection: boolean = candidate.section?.name == programme.section?.name

// console.log(`is samesection ${isSameSection}  and ${candidate.section?.name} and ${programme.section?.name}`);


    if (!isSameSection) {
      throw new HttpException(`the candidate ${candidate.name} can't participate in programme ${programme.programCode}  ${programme.name} , check the section of candidate`, HttpStatus.BAD_REQUEST)
    }

    // checking the category

    const isSameCategory: boolean = candidate.category?.name == programme.category?.name

// console.log(`is samesection ${isSameCategory}  and ${candidate.category?.name} and ${programme.category?.name}`);


    if (!isSameCategory) {
      throw new HttpException(`the candidate ${candidate.name} can't participate in programme ${programme.programCode}  ${programme.name} , check the category of candidate`, HttpStatus.BAD_REQUEST)
    }

    // -------------------------------
    // -------------------------------
    // -------------------------------

    //  checking the all rules from category settings are regulated

    //  category
    const category_id: number = candidate.category?.id
    const category: Category = await this.categoryService.findOne(category_id);



    //  settings
    const settings: CategorySettings = category.settings;


    // checking is CANDIDATE covered maximum programme limit

    if (settings.maxProgram) {
      const programmes: CandidateProgramme[] = candidate.candidateProgrammes
      if (programmes.length >= settings.maxProgram) {
        throw new HttpException("THe candidate has covered maximum programme count", HttpStatus.BAD_REQUEST)
      }
    }

    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter((e: CandidateProgramme) => {
        return e.programme.type == Type.SINGLE
      })
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException("THe candidate has covered maximum single programme count", HttpStatus.BAD_REQUEST)
      }
    }




    // checking is it covered maximum single programme limit

    if (settings.maxSingle) {
      const SinglePrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter((e: CandidateProgramme) => {
        return e.programme.type == Type.SINGLE
      })
      if (SinglePrograms.length >= settings.maxSingle) {
        throw new HttpException("THe candidate has covered maximum single programme count", HttpStatus.BAD_REQUEST)
      }
    }

    // checking is it covered maximum group programme limit

    if (settings.maxSingle) {
      const groupPrograms: CandidateProgramme[] = candidate.candidateProgrammes.filter((e: CandidateProgramme) => {
        return e.programme.type == Type.GROUP
      })
      if (groupPrograms.length >= settings.maxGroup) {
        throw new HttpException("THe candidate has covered maximum group programme count", HttpStatus.BAD_REQUEST)
      }
    }

    // -------------------------------
    // -------------------------------
    // -------------------------------

    // checking the limit of candidates in a team covered
    const team: Team = candidate.team;
    const groupNumber = updateCandidateProgrammeInput.groupNumber

    //  checking the team of out dated candidate 
    const outDatedCandidate = await this.candidateProgrammeRepository.findOne({
      where: { id },
      relations: ['candidate', 'candidate.team']
    })

    // console.log(outDatedCandidate.candidate?.team?.name, "  ", team.name);


    if (team.name != outDatedCandidate.candidate?.team?.name) {

      throw new HttpException(`The candidate ${candidate.name} is not on team ${team.name}`, HttpStatus.BAD_REQUEST)
    }

    try {

      return this.candidateProgrammeRepository.update(id, {
        candidate,
        groupNumber
      })
    } catch (e) {
      throw new HttpException("An Error have when inserting data , please check the all required fields are filled ", HttpStatus.INTERNAL_SERVER_ERROR, e)
    }
  }

  async remove(id: number) {
    // checking is the candidateProgramme exist
    const candidateProgramme: CandidateProgramme = await this.candidateProgrammeRepository.findOneBy({ id })
    if (!candidateProgramme) {
      throw new HttpException("The candidate programme is not exist", HttpStatus.BAD_REQUEST)
    }
    try {
      return this.candidateProgrammeRepository.delete(id)
    } catch (e) {
      throw new HttpException("An error occurred when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, e)
    }
  }


  async getCandidatesOfProgramme(programCode: string) {
    const programme: Programme = await this.programmeService.findOneByCode(programCode)

    return programme.candidateProgramme;
  }


  // upload Normal Result 

  async addResult(programCode: string, input: AddResult[]) {
    const candidateProgrammeOfProgramme: CandidateProgramme[] = await this.getCandidatesOfProgramme(programCode);

    // checking the two input ore equal

    const isSameLength = candidateProgrammeOfProgramme.length === input.length

    // sorting data

   const sortedCandidateProgramme = candidateProgrammeOfProgramme.sort((a: CandidateProgramme, b: CandidateProgramme) => {
    console.log(a.candidate?.chestNO);
    
      return a.candidate?.chestNO - b.candidate?.chestNO
    })

    const sortedInput = input.sort((a: AddResult, b: AddResult) => {
      return a.chestNo - b.chestNo
    })

    if (!isSameLength) {
      throw new HttpException(`An error form or result upload , please check the result of all candidates of programme ${programCode} is uploaded`, HttpStatus.BAD_REQUEST)
      
    }else{
      for (let index = 0; index < input.length; index++) {
        const eOne: AddResult = sortedInput[index];
        const eTwo: CandidateProgramme = sortedCandidateProgramme[index];

        console.log(`${eTwo?.candidate?.chestNO}  and   ${eOne?.chestNo}`);

        if(eOne?.chestNo != eTwo.candidate?.chestNO){
          throw new HttpException(`An error form or result upload , please check the candidate ${eOne.chestNo} is in programme ${programCode}`, HttpStatus.BAD_REQUEST)
        }
        
      }
      console.log("same length");

    }

    // adding the mark

    for (let index = 0; index < input.length; index++) {
      const e: AddResult = sortedInput[index];
      const candidateProgramme: CandidateProgramme = sortedCandidateProgramme[index];

      // checking is eligible for any grade
      const totalMark : number = e.markOne + e.markTwo + e.markThree
      const allGrades : Grade[]= await this.gradeService.findAll()
      // Descending sorting
      const sortedGrade : Grade[] = allGrades.sort((a: Grade, b: Grade) => {
        return  b.percentage - a.percentage
      })

    //  checking each grades percentage and the eligibility of the candidate
      for (let index = 0; index < sortedGrade.length; index++) {
        const grade: Grade = sortedGrade[index];
        if(totalMark >= (grade.percentage/100) * 30){
          candidateProgramme.grade = grade
          break;
        }
      }

      // sorting the candidateProgramme by the totalMark
      const sortedCandidateProgrammeByTotalMark = input.sort((a: AddResult, b: AddResult) => {
        return (b.markOne + b.markTwo + b.markThree) - (a.markOne + a.markTwo + a.markThree)
      })

      // giving them position
      const allPositions : Position[] =await this.positionService.findAll()

      // sort the position by its mark
      const sortedPosition : Position[] = allPositions.sort((a: Position, b: Position) => {
        return b.pointSingle - a.pointSingle
      })

      // giving the position to the candidate
      for (let i = 0; i < sortedPosition.length; i++) {
        const e = sortedPosition[i];
        const c = sortedCandidateProgrammeByTotalMark[i]

        
        
      }
      
      

      
      // candidateProgramme.markOne = e.markOne;
      // candidateProgramme.markTwo = e.markTwo;
      // candidateProgramme.markThree = e.markThree;

      // await this.candidateProgrammeRepository.save(candidateProgramme)
    }


    return candidateProgrammeOfProgramme ;

  }


  // generating grade
  
 async generateGrade(candidateProgramme){
    const allGrades : Grade[]= await this.gradeService.findAll()
    // Descending sorting
    const sortedGrade : Grade[] = allGrades.sort((a: Grade, b: Grade) => {
      return  b.percentage - a.percentage
    })

  //  checking each grades percentage and the eligibility of the candidate
    for (let index = 0; index < sortedGrade.length; index++) {
      const grade: Grade = sortedGrade[index];
      // if(totalMark >= (grade.percentage/100) * 30){
      //   candidateProgramme.grade = grade
      //   break;
      // }
    }
  }



}


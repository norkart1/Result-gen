import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJudgeInput } from './dto/create-judge.input';
import { UpdateJudgeInput } from './dto/update-judge.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Judge } from './entities/judge.entity';
import { ProgrammesService } from 'src/programmes/programmes.service';
import { LoginService } from 'src/credentials/login/login.service';
import { UploadMarkInput } from './dto/upload-mark.input';
import { CandidatesService } from 'src/candidates/candidates.service';
import { CandidateProgrammeService } from 'src/candidate-programme/candidate-programme.service';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { CandidateProgramme } from 'src/candidate-programme/entities/candidate-programme.entity';
import { ResultGenService } from 'src/candidate-programme/result-gen.service';
import { AddResult } from 'src/candidate-programme/dto/add-result.dto';
import { Programme } from 'src/programmes/entities/programme.entity';
import { arrayInput } from 'src/candidate-programme/dto/array-input.dto';

@Injectable()
export class JudgeService {
  constructor(
    @InjectRepository(Judge)
    private judgeRepository: Repository<Judge>,
    private readonly programmesService: ProgrammesService,
    private readonly candidatesService: CandidatesService,
    private readonly LoginService: LoginService,
    private readonly candidateProgrammeService: CandidateProgrammeService,
    private readonly resultGenService: ResultGenService,
  ) {}

  async create(createJudgeInput: CreateJudgeInput) {
    // create a new judge
    const { username, password, judgeName, programmeCode } = createJudgeInput;

    // check if username already exists
    const isAlreadyExist = await this.judgeRepository.findOneBy({ username });

    if (isAlreadyExist) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }

    // check is judgeName is correct format
    const regex = new RegExp(/^judge[1-7]$/);

    if (!regex.test(judgeName)) {
      throw new HttpException('Judge name is not in correct format', HttpStatus.BAD_REQUEST);
    }

    // checking is programme exist
    const programmeId = await this.programmesService.findOneByCode(programmeCode);

    if (!programmeId) {
      throw new HttpException('Programme does not exist', HttpStatus.BAD_REQUEST);
    }

    // hash password
    const hashedPassword = await this.LoginService.hashPassword(password);

    // create new judge
    try {
      const newJudge = this.judgeRepository.create({
        username,
        password: hashedPassword,
        judgeName,
        programme: programmeId,
      });
      await this.judgeRepository.save(newJudge);
      return newJudge;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    try {
      const judges = this.judgeRepository.find({ relations: ['programme'], order: { id: 'DESC' } });
      return judges;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    try {
      const judge = this.judgeRepository.findOne({
        where: { id },
        relations: ['programme'],
      });
      return judge;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateJudgeInput: UpdateJudgeInput) {
    const { username, password, judgeName, programmeCode } = updateJudgeInput;

    // check if username already exists
    const isAlreadyExist = this.judgeRepository.findOneBy({ username });

    if (isAlreadyExist) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }

    // checking is programme exist

    const programmeId = await this.programmesService.findOneByCode(programmeCode);

    if (!programmeId) {
      throw new HttpException('Programme does not exist', HttpStatus.BAD_REQUEST);
    }

    // hash password

    const hashedPassword = await this.LoginService.hashPassword(password);

    // update judge

    try {
      const updatedJudge = this.judgeRepository.update(id, {
        username,
        password: hashedPassword,
        judgeName,
        programme: programmeId,
      });
      return updatedJudge;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: number) {
    // check the judge exist

    const judge = this.judgeRepository.findOneBy({ id });

    if (!judge) {
      throw new HttpException('Judge does not exist', HttpStatus.BAD_REQUEST);
    }

    try {
      const deletedJudge = this.judgeRepository.delete(id);
      return deletedJudge;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadMarkByJudge(  // DO FIRST THE DTO SETTING OF CANDIDATE AND PROGRAMME EXCEL UPLOAD
    judgeId: number,
    programCode: string,
    uploadMarkByJudgeInput: arrayInput,
  ) {
    // check if judge exist

    const judge =await this.judgeRepository.findOneBy({ id: judgeId });

    if (!judge) {
      throw new HttpException('Judge does not exist', HttpStatus.BAD_REQUEST);
    }

    
    // check if programme exist

    const programme : Programme = await this.programmesService.findOneByCode(programCode);

    if (!programme) {
      throw new HttpException('Programme does not exist', HttpStatus.BAD_REQUEST);
    }


    // Verify the result
    await this.resultGenService.verifyResult(uploadMarkByJudgeInput.inputs  , programCode);

    try{
      const UpdatedCandidateProgramme = await this.resultGenService.judgeResultCheck(uploadMarkByJudgeInput.inputs , programme.candidateProgramme , judge.judgeName );
      if(!UpdatedCandidateProgramme){
        throw new HttpException('can\'t add mark to candidates', HttpStatus.BAD_REQUEST);
      }
      // return this.remove(judgeId);
    }catch
    (err){
      throw new HttpException(err.message , HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

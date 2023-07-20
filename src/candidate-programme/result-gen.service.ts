import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateProgramme } from './entities/candidate-programme.entity';
import { AddResult } from './dto/add-result.dto';
import { GradesService } from 'src/grades/grades.service';
import { Grade } from 'src/grades/entities/grade.entity';
import { PositionService } from 'src/position/position.service';
import { Position } from 'src/position/entities/position.entity';
import { CandidateProgrammeService } from './candidate-programme.service';
import { ProgrammesService } from 'src/programmes/programmes.service';
import { Programme, Type } from 'src/programmes/entities/programme.entity';
import { DetailsService } from 'src/details/details.service';
import { arrayInput } from './dto/array-input.dto';
var firebase = require('firebase/app');
var firebasedb = require('firebase/database');

@Injectable()
export class ResultGenService {
  constructor(
    @InjectRepository(CandidateProgramme)
    private candidateProgrammeRepository: Repository<CandidateProgramme>,
    private readonly gradeService: GradesService,
    private readonly positionService: PositionService,
    private readonly candidateProgrammeService: CandidateProgrammeService,
    private readonly programmeService: ProgrammesService,
    private readonly DetailService: DetailsService,
  ) {}

  // upload Normal Result

  async addResult(programCode: string, input: arrayInput) {
    // check if programme exist

    const programme: Programme = await this.programmeService.findOneByCode(programCode);

    // all candidates of programme

    let candidatesOfProgramme: CandidateProgramme[] = programme.candidateProgramme;

    if (!programme) {
      throw new HttpException('Programme does not exist', HttpStatus.BAD_REQUEST);
    }

    // verify the result
    await this.verifyResult(input.inputs, programCode);

    // // Setting Marks
    // for (let index = 0; index < input.inputs.length; index++) {
    //   const element = input.inputs[index];
    //   const candidate: CandidateProgramme = candidatesOfProgramme.find(
    //     candidate => candidate.candidate?.chestNO === element.chestNo,
    //   );

    //   candidate.mark = element.mark;
    // }

    // // Clear the grade first before generating new one

    // for (let index = 0; index < candidatesOfProgramme.length; index++) {
    //   const candidate = candidatesOfProgramme[index];
    //   candidate.grade = null;
    // }

    // //  Generating Grade for each candidate
    // for (let index = 0; index < candidatesOfProgramme.length; index++) {
    //   const candidate = candidatesOfProgramme[index];
    //   const grade: Grade = await this.generateGrade(candidate.mark, programme);
    //   candidate.grade = grade;
    // }

    // // Generating Position for each candidate

    // // Clear the position first before generating new one
    // for (let index = 0; index < candidatesOfProgramme.length; index++) {
    //   const candidate = candidatesOfProgramme[index];
    //   candidate.position = null;
    // }

    // candidatesOfProgramme = await this.generatePosition(candidatesOfProgramme, programCode);

    // // set the point for each candidate
    // for (let index = 0; index < candidatesOfProgramme.length; index++) {
    //   let candidate = candidatesOfProgramme[index];
    //   candidate = await this.generatePoint(candidate);
    // }

    // return candidatesOfProgramme;

    // process the result
    candidatesOfProgramme = await this.processResult(candidatesOfProgramme, programme);
    try{

      return this.candidateProgrammeRepository.save(candidatesOfProgramme);
    }catch(error){
      throw new HttpException("Error on updating result", HttpStatus.BAD_REQUEST);
    }
  }

  // result upload process

  async processResult(candidatesOfProgramme: CandidateProgramme[] , programme: Programme){
     // Clear the grade first before generating new one

     for (let index = 0; index < candidatesOfProgramme.length; index++) {
      const candidate = candidatesOfProgramme[index];
      candidate.grade = null;
    }

    //  Generating Grade for each candidate
    for (let index = 0; index < candidatesOfProgramme.length; index++) {
      const candidate = candidatesOfProgramme[index];
      const grade: Grade = await this.generateGrade(candidate.mark, programme);
      candidate.grade = grade;
    }

    // Generating Position for each candidate

    // Clear the position first before generating new one
    for (let index = 0; index < candidatesOfProgramme.length; index++) {
      const candidate = candidatesOfProgramme[index];
      candidate.position = null;
    }

    candidatesOfProgramme = await this.generatePosition(candidatesOfProgramme, programme.programCode);

    // set the point for each candidate
    for (let index = 0; index < candidatesOfProgramme.length; index++) {
      let candidate = candidatesOfProgramme[index];
      candidate = await this.generatePoint(candidate);
    }

    return candidatesOfProgramme;
  }

  // verify the result

  async verifyResult(input: AddResult[], programCode: string) {
    // all candidates of programme
    const candidatesOfProgramme: CandidateProgramme[] =
      await this.candidateProgrammeService.getCandidatesOfProgramme(programCode);

    // checking the two input ore equal

    const isSameLength = candidatesOfProgramme.length === input.length;

    // sorting data

    let sortedCandidateProgramme = candidatesOfProgramme.sort(
      (a: CandidateProgramme, b: CandidateProgramme) => {
        return a.candidate?.chestNO - b.candidate?.chestNO;
      },
    );

    const sortedInput = input.sort((a: AddResult, b: AddResult) => {
      return a.chestNo - b.chestNo;
    });

    if (!isSameLength) {
      throw new HttpException(
        `An error form of result upload , please check the result of all candidates of programme ${programCode} is uploaded`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      for (let index = 0; index < input.length; index++) {
        const input: AddResult = sortedInput[index];

        const cProgramme: CandidateProgramme = sortedCandidateProgramme[index];

        // checking is candidate have in this programme
        if (input?.chestNo != cProgramme.candidate?.chestNO) {
          throw new HttpException(
            `An error form of result upload , please check the candidate ${input.chestNo} is in programme ${programCode}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  // generating grade

  async generateGrade(mark: number, programme: Programme) {
    const allGrades: Grade[] = await this.gradeService.findAll();
    // Descending sorting
    const sortedGrade: Grade[] = allGrades.sort((a: Grade, b: Grade) => {
      return b.percentage - a.percentage;
    });

    //  checking each grades percentage and the eligibility of the candidate
    for (let index = 0; index < sortedGrade.length; index++) {
      const grade: Grade = sortedGrade[index];
      if (mark >= (grade.percentage / 100) * programme.totalMark) {
        return grade;
      }
    }
  }

  // generate position

  async generatePosition(CandidateProgramme: CandidateProgramme[], programCode: string) {
    const Positions: Position[] = await this.positionService.findAll();

    // giving the position

    CandidateProgramme = await this.multiplePosition(CandidateProgramme, Positions, programCode);

    //  CandidateProgramme = this.multiplePosition(sorted, Positions, CandidateProgramme);
    // console.log(CandidateProgramme);

    return CandidateProgramme;
  }

  async multiplePosition(
    CandidateProgramme: CandidateProgramme[],
    Positions: Position[],
    programCode: string,
  ) {
    var totals = [];
    for (var i = 0; i < CandidateProgramme.length; i++) {
      var total = CandidateProgramme[i].mark;
      totals.push(total);
    }
    const sorted = [...new Set(totals)].sort((a, b) => b - a);
    const rank = new Map(sorted.map((x, i) => [x, i + 1]));
    const changed = totals.map(x => rank.get(x));

    // checking is there have multiple position
    if (this.containsDuplicates(changed, Positions.length)) {
      const isMultiplePositionAllowed: boolean = (await this.DetailService.findIt())
        .isMultipleResultAllowed; // || false;

      if (!isMultiplePositionAllowed) {
        await this.programmeService.setAnyIssue(programCode, true);
      }
    } else {
      await this.programmeService.setAnyIssue(programCode, false);
    }

    // giving the position
    for (let index = 0; index < CandidateProgramme.length; index++) {
      const candidateProgramme: CandidateProgramme = CandidateProgramme[index];
      const position: Position = Positions[changed[index] - 1];

      if (position) {
        candidateProgramme.position = position;
      }
    }

    return CandidateProgramme;
  }

  async generatePoint(CandidateProgramme: CandidateProgramme) {
    // giving the point of grade
    const grade: Grade = CandidateProgramme.grade;
    CandidateProgramme.point = 0;

    if (grade) {
      if (CandidateProgramme.programme.type == Type.SINGLE) {
        CandidateProgramme.point = grade.pointSingle;
      } else if (CandidateProgramme.programme.type == Type.GROUP) {
        CandidateProgramme.point = grade.pointGroup;
      } else if (CandidateProgramme.programme.type == Type.HOUSE) {
        CandidateProgramme.point = grade.pointHouse;
      }
    }

    // giving the point of position
    const position: Position = CandidateProgramme.position;

    if (position) {
      if (CandidateProgramme.programme.type == Type.SINGLE) {
        CandidateProgramme.point += position.pointSingle;
      } else if (CandidateProgramme.programme.type == Type.GROUP) {
        CandidateProgramme.point += position.pointGroup;
      } else if (CandidateProgramme.programme.type == Type.HOUSE) {
        CandidateProgramme.point += position.pointHouse;
      }
    }

    return CandidateProgramme;
  }

  // checking as array contains duplicates
  containsDuplicates(array: number[], positionCount: number) {
    const allowedNumbers = [];
    for (let index = 1; index <= positionCount; index++) {
      allowedNumbers.push(index);
    }
    const encounteredNumbers = new Set();

    for (const num of array) {
      if (allowedNumbers.includes(num)) {
        if (encounteredNumbers.has(num)) {
          return true; // Found a duplicate of 1, 2, or 3
        } else {
          encounteredNumbers.add(num);
        }
      }
    }

    return false; // No duplicate of 1, 2, or 3 found
  }

  judgeResultCheck(
    input: AddResult[],
    candidateProgrammes: CandidateProgramme[],
    judgeName: string,
  ) {
    const sortedInput = input.sort((a: AddResult, b: AddResult) => {
      return a.chestNo - b.chestNo;
    });

    const sortedCandidateProgramme = candidateProgrammes.sort(
      (a: CandidateProgramme, b: CandidateProgramme) => {
        return a.candidate.chestNO - b.candidate.chestNO;
      },
    );


    for (let i = 0; i < sortedInput.length; i++) {
      const input = sortedInput[i];
      const candidateProgramme = sortedCandidateProgramme[i];

      if (input.chestNo != candidateProgramme.candidate.chestNO) {
        throw new HttpException(
          `Chest No ${input.chestNo} is not match with ${candidateProgramme.candidate.chestNO}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      
      candidateProgramme[judgeName] = input.mark;

      // save the candidate programme
       this.candidateProgrammeRepository.save(candidateProgramme);
    }

    return sortedCandidateProgramme;

  }

  async approveJudgeResult(programCode: string, judgeName: string) {
    // check if programme exist

    const programme : Programme = await this.programmeService.findOneByCode(programCode);

    if (!programme) {
      throw new HttpException('Programme does not exist', HttpStatus.BAD_REQUEST);
    }

    // check if judge name is correct format
    const regex = new RegExp(/^judge[1-7]$/);

    if (!regex.test(judgeName)) {
      throw new HttpException('Judge name is not in correct format', HttpStatus.BAD_REQUEST);
    }

    // all candidates of programme

    let candidatesOfProgrammes: CandidateProgramme[] = programme.candidateProgramme;

    // add the mark of judge to mark of candidate programme

    for (let index = 0; index < candidatesOfProgrammes.length; index++) {
      const candidateProgramme = candidatesOfProgrammes[index];

      if(!candidateProgramme[judgeName]){
        throw new HttpException(`Judge ${judgeName} result is not uploaded`, HttpStatus.BAD_REQUEST);
      }

      if (candidateProgramme.mark) {
        candidateProgramme.mark = ((candidateProgramme.mark + candidateProgramme[judgeName]) / 20) * 10;
      }else{
        candidateProgramme.mark = candidateProgramme[judgeName];
      }
    }

    // process the result
    candidatesOfProgrammes = await this.processResult(candidatesOfProgrammes, programme);

    // set null to judge result
    for (let index = 0; index < candidatesOfProgrammes.length; index++) {
      const candidateProgramme = candidatesOfProgrammes[index];
      candidateProgramme[judgeName] = null;
    }

    try{
      return this.candidateProgrammeRepository.save(candidatesOfProgrammes);
    }catch(error){
      throw new HttpException("Error on updating result", HttpStatus.BAD_REQUEST);
    }

  }

  // live result using firebase
  async liveResult() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDhaKh0v1SY2zMr-jfT-TRkjsyQb0I5-ws',
      authDomain: 'live-result-235df.firebaseapp.com',
      databaseURL: 'https://live-result-235df-default-rtdb.firebaseio.com',
      projectId: 'live-result-235df',
      storageBucket: 'live-result-235df.appspot.com',
      messagingSenderId: '265886718567',
      appId: '1:265886718567:web:b54125e6b172104ce112c2',
      measurementId: 'G-E19GCCCFYE',
    };

    var app = firebase.initializeApp(firebaseConfig);
    var db = firebasedb.getDatabase(app);
    console.log(db);

    var timeInSec = 5;

    var datas = await this.candidateProgrammeRepository.find();

    // [
    //   { 'age': 1, name: 'ramu' },
    //   { 'age': 12, name: 'jalu' },
    //   { 'age': 1234, name: 'hamu' },
    //   { 'age': 15, name: 'ramuh' },
    //   { 'age': 126, name: 'jaluh' },
    //   { 'age': 1237, name: 'hamuh' }
    // ]
    let count = 0;

    var dat = {
      '/main': datas,
    };
    firebasedb.update(firebasedb.ref(db), dat);
    var datList;
    firebasedb
      .get(firebasedb.child(firebasedb.ref(db), 'main'))
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          datList = snapshot.val();
        } else {
          console.log('No data available');
        }
      })
      .catch(error => {
        console.error(error);
      });

    var ref = firebasedb.ref(db, 'current');

    const intervalId = setInterval(() => {
      firebasedb
        .get(ref)
        .then(snapshot => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
          } else {
            console.log('No data available');
          }
        })
        .catch(error => {
          console.error(error);
        });
      datList[count]['startTime'] = new Date().getTime();
      datList[count]['time'] = timeInSec;
      console.log(datList);
      var upo = {
        '/current': datList[count],
      };
      firebasedb.update(firebasedb.ref(db), upo);

      count++;

      if (count === datList.length) {
        console.log('stopped');
        // firebasedb.remove(firebasedb.child(firebasedb.ref(db), 'current'))
        firebasedb.update(firebasedb.ref(db), { '/current': 'no data' });
        clearInterval(intervalId);
      }
    }, timeInSec * 1000);
  }
}

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
import { initializeApp } from 'firebase-admin/app';
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
  ) {}

  // upload Normal Result

  async addResult(programCode: string, input: AddResult[]) {
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
        `An error form or result upload , please check the result of all candidates of programme ${programCode} is uploaded`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      for (let index = 0; index < input.length; index++) {
        const input: AddResult = sortedInput[index];

        const cProgramme: CandidateProgramme = sortedCandidateProgramme[index];

        // checking is candidate have in this programme
        if (input?.chestNo != cProgramme.candidate?.chestNO) {
          throw new HttpException(
            `An error form or result upload , please check the candidate ${input.chestNo} is in programme ${programCode}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // Total Mark
        var totalMark = this.addMark(input);

        sortedInput[index].totalMark = totalMark;

        //  Genarating Grade

        sortedCandidateProgramme[index].grade = await this.generateGrade(totalMark, cProgramme);

        // Setting Marks

        sortedCandidateProgramme[index].markOne = input.markOne;
        sortedCandidateProgramme[index].markTwo = input.markTwo;
        sortedCandidateProgramme[index].markThree = input.markThree;
      }

      sortedCandidateProgramme = await this.generatePosition(sortedCandidateProgramme, sortedInput);
    }

    // Posting to database

    return this.candidateProgrammeRepository.save(sortedCandidateProgramme);
  }

  // Upload Result By Judge Panel of Three Members

  async addResultByJudgePanel(programCode: string, input: AddResult[]) {
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
        `An error form or result upload , please check the result of all candidates of programme ${programCode} is uploaded`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      for (let index = 0; index < input.length; index++) {
        const input: AddResult = sortedInput[index];

        const cProgramme: CandidateProgramme = sortedCandidateProgramme[index];

        // checking is candidate have in this programme
        if (input?.chestNo != cProgramme.candidate?.chestNO) {
          throw new HttpException(
            `An error form or result upload , please check the candidate ${input.chestNo} is in programme ${programCode}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  // add the mark
  addMark(addMark: AddResult) {
    const { markOne, markThree, markTwo } = addMark;
    return markOne + markThree + markTwo;
  }

  // generating grade

  async generateGrade(totalMark: number, candidateProgramme: CandidateProgramme) {
    const allGrades: Grade[] = await this.gradeService.findAll();
    // Descending sorting
    const sortedGrade: Grade[] = allGrades.sort((a: Grade, b: Grade) => {
      return b.percentage - a.percentage;
    });

    //  checking each grades percentage and the eligibility of the candidate
    for (let index = 0; index < sortedGrade.length; index++) {
      const grade: Grade = sortedGrade[index];
      if (totalMark >= (grade.percentage / 100) * 30) {
        // on the place 30 need to be dynamic
        return grade;
      }
    }
  }

  // generate position

  async generatePosition(CandidateProgramme: CandidateProgramme[], input: AddResult[]) {
    // sorting the input
    const sorted = input.sort((a: AddResult, b: AddResult) => {
      return b.totalMark - a.totalMark;
    });

    const Positions: Position[] = await this.positionService.findAll();

    // giving the position

    // CandidateProgramme = this.singlePosition(CandidateProgramme,sorted,Positions)

    CandidateProgramme = this.multiplePosition(sorted, Positions, CandidateProgramme);

    return CandidateProgramme;
  }

  singlePosition(CandidateProgramme: CandidateProgramme[], input: AddResult[], Positions) {
    input.forEach((inputData, indexOfInput) => {
      CandidateProgramme.forEach((cProgrammme, cProgrammeIndex) => {
        if (cProgrammme.candidate?.chestNO == inputData.chestNo) {
          Positions.forEach(pos => {
            if (indexOfInput + 1 == pos.value) {
              CandidateProgramme[cProgrammeIndex].position = pos;
            }
          });
        }
      });
    });

    return CandidateProgramme;
  }

  multiplePosition(
    input: AddResult[],
    Positions: Position[],
    CandidateProgramme: CandidateProgramme[],
  ) {
    var totals = [];

    for (var i = 0; i < input.length; i++) {
      var total = input[i].totalMark;
      totals.push(total);
    }

    const sorted = [...new Set(totals)].sort((a, b) => b - a);
    const rank = new Map(sorted.map((x, i) => [x, i + 1]));
    const changed = totals.map(x => rank.get(x));

    input.forEach((e: AddResult, i) => {
      e.Position = changed[i];
    });

    // giving the position

    input.forEach((inputData, indexOfInput) => {
      CandidateProgramme.forEach((cProgrammme, cProgrammeIndex) => {
        if (cProgrammme.candidate?.chestNO == inputData.chestNo) {
          Positions.forEach(pos => {
            if (inputData.Position == pos.value) {
              CandidateProgramme[cProgrammeIndex].position = pos;
            }
          });
        }
      });
    });

    return CandidateProgramme;
  }

  // DYNAMIC RESULT ADDING

  async addDynamicResult(programCode: string, input: AddResult[]) {
    const JudgeCount = 3;

    
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

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';
import { read, utils } from 'xlsx';
import { CreateCandidateInput } from './dto/create-candidate.input';

@Controller('candidates')
export class CandidatesController {

  constructor(
    private readonly candidatesService: CandidatesService
  ) {

  }


  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);

  //   const wb = read(file.buffer, { type: 'buffer' });
  //   console.log(wb.SheetNames);

  //   // taking first worksheet from workbook to read data

  //   const ws = wb.Sheets[wb.SheetNames[0]];
  //   const values: CreateCandidateInput[] = utils.sheet_to_json(ws)
  //   console.log(values);

  //   // returning to service page

  //   return this.candidatesService.createMany(values)

  // }
}

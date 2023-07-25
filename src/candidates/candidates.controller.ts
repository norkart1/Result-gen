import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  // upload image
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('chestNo') id: number) {
    console.log(id);

    console.log(file);
  }

  // upload multiple images
  @Post('uploadMultiple')
  @UseInterceptors(FileInterceptor('file'))
  uploadMultipleFiles(@UploadedFile() files: Express.Multer.File[]) {
    console.log(files);
  }
}

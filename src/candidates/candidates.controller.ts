import { Body, Controller, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';


@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
  ) // , private readonly googleDriveService: GoogleDriveService
  {}

  // upload image
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('chestNo') chestNo: number) {
    // console.log(chestNo);  
    
    return this.candidatesService.uploadFile(chestNo, file.buffer, file.originalname, file.mimetype);
  }

  // upload multiple images 
  // neet to get array of files
  @Post('uploadMultiple')
  @UseInterceptors(FileInterceptor('files'))
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[] ) {
    console.log(files);
    
    return this.candidatesService.uploadFiles( files);
  }
}

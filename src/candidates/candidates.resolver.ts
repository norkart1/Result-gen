import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';
import { UsePipes, ValidationPipe } from '@nestjs/common';
// import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { CandidatePipe } from './pipe/candidates.pipe';
import { CreateCandidateByGoogleSheetInput } from './dto/create-cadidate-by-google-sheet.dto';
import { GoogleSheetPipe } from './pipe/googleSheet.pipe';
import { read, utils } from 'xlsx';

// free
import { Stream } from 'stream';
import { createCandidateType } from './utils/candidates.types';
import { Section } from 'src/sections/entities/section.entity';
import { SectionsService } from 'src/sections/sections.service';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
// free over



@Resolver(() => Candidate)
export class CandidatesResolver {
  constructor(
    private readonly candidatesService: CandidatesService ,
    private readonly sectionService: SectionsService
    ) {}

  @UsePipes(CandidatePipe)
  @Mutation(() => Candidate)
  createCandidate(@Args('createCandidateInput') createCandidateInput: CreateCandidateInput) {
    return this.candidatesService.create(createCandidateInput);
  }

  // @UsePipes(GoogleSheetPipe)
  // @Mutation(() => Candidate)
  // createCandidateByGoogleSheet(@Args('createCandidateByGoogleSheetInput') createCandidateByGoogleSheetInput: CreateCandidateByGoogleSheetInput) {
  //   return this.candidatesService.createByGoogleSheet(createCandidateByGoogleSheetInput);
  // }

  @Query(() => [Candidate], { name: 'candidates' })
  findAll() {
    return this.candidatesService.findAll();
  }

  @Query(() => Candidate, { name: 'candidate' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidatesService.findOne(id);
  }


  @ResolveField(returns => Section)
  user(@Parent() candidate:Candidate){
    return this.sectionService.findOne(candidate.section.id)
  }

  @UsePipes(CandidatePipe)
  @Mutation(() => Candidate)
  updateCandidate(@Args('updateCandidateInput') updateCandidateInput: UpdateCandidateInput) {
    return this.candidatesService.update(updateCandidateInput.id, updateCandidateInput);
  }

  @Mutation(() => Candidate)
  removeCandidate(@Args('id', { type: () => Int }) id: number) {
    return this.candidatesService.remove(id);
  }




  // free data
  

//   @Mutation(() => Boolean)
//     async uploadFile(@Args({name: 'file', type: () => GraphQLUpload}) 
//     {
//         createReadStream,
//         filename,
//         mimetype,
//         encoding,
//     }: FileUpload): Promise<boolean> {
//         console.log('uploadFile: ', filename);
//         console.log('uploadFile: ', createReadStream);
//         console.log('uploadFile: ', mimetype);
//         console.log('uploadFile: ', encoding);
        

//         // read the file and get the buffer value to a variable called FileBuffer
//         const FileBuffer = await new Promise((resolve, reject) => {
//              const chunks = [];
//             createReadStream()
//                 .on('data', (chunk) => chunks.push(chunk))
//                 .on('error', reject)
//                 .on('end', () => resolve(Buffer.concat(chunks)));
//         }); 

//         // write the buffer value to a file
//             console.log(FileBuffer);
            
//         // read the buffer 
//         const wb = read(FileBuffer, {type: 'buffer'});
//         console.log(wb.SheetNames);

//         // taking first worksheet from workbook to read data
//         const ws = wb.Sheets[wb.SheetNames[0]];
//         const values : CreateCandidateInput[] = utils.sheet_to_json(ws)
//         console.log(values);

//         // values.forEach( (data : CreateCandidateInput ,i : number) =>{
//         //   // console.log(data.name)
//         //   this.candidatesService.create(data)
//         // })

// //  this.candidatesService.createMany(values)


//         return true;
//     }
}

import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class GoogleSheetPipe implements PipeTransform {
  constructor(private teamService:TeamsService) {

  }
  async transform(value: any, metadata: ArgumentMetadata) {

    let {sheetId , teamName} = value;
    console.log(teamName);
    
    if (teamName){
        console.log(teamName);
        const team = await this.teamService.findOneByName(teamName)
        console.log(team);
        
          if (!team){ 
              console.log(teamName);
              throw new HttpException('Team Not Found', HttpStatus.NOT_FOUND);
              
          }
      }

    if (sheetId.length != 44){
        console.log(sheetId.length);
        throw new HttpException('Invalid Sheet ID', HttpStatus.BAD_REQUEST);
        
    }


    

    return value;
  }
}

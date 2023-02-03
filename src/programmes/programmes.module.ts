import { Module } from '@nestjs/common';
import { ProgrammesService } from './programmes.service';
import { ProgrammesResolver } from './programmes.resolver';

@Module({
  providers: [ProgrammesResolver, ProgrammesService]
})
export class ProgrammesModule {}

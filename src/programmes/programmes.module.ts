import { Module } from '@nestjs/common';
import { ProgrammesService } from './programmes.service';
import { ProgrammesResolver } from './programmes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programme } from './entities/programme.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Programme])],
  providers: [ProgrammesResolver, ProgrammesService]
})
export class ProgrammesModule {}

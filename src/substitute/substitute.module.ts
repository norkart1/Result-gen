import { Module } from '@nestjs/common';
import { SubstituteService } from './substitute.service';
import { SubstituteResolver } from './substitute.resolver';

@Module({
  providers: [SubstituteResolver, SubstituteService]
})
export class SubstituteModule {}

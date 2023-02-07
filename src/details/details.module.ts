import { Module } from '@nestjs/common';
import { DetailsService } from './details.service';
import { DetailsResolver } from './details.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detail } from './entities/detail.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Detail])],
  providers: [DetailsResolver, DetailsService]
})
export class DetailsModule {}

import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionResolver } from './position.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Position])],
  providers: [PositionResolver, PositionService],
  exports:[PositionService]
})
export class PositionModule {}

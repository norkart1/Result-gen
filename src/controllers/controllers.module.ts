import { Module } from '@nestjs/common';
import { ControllersService } from './controllers.service';
import { ControllersResolver } from './controllers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller } from './entities/controller.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Controller])],
  providers: [ControllersResolver, ControllersService]
})
export class ControllersModule {}

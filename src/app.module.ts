import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandidatesModule } from './candidates/candidates.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { SectionsModule } from './sections/sections.module';
import { GradesModule } from './grades/grades.module';
import { TeamManagersModule } from './team-managers/team-managers.module';
import { TeamsModule } from './teams/teams.module';
import { MediaModule } from './media/media.module';


@Module({
  imports: [

    // connecting to mysql server
    
    TypeOrmModule.forRoot({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "B@buL@bu123",
    database: "gql",
    entities: [],
    synchronize: true
  }),

  // graphql configuration

  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  }),

  CandidatesModule,
  ProgrammesModule,
  SectionsModule,
  GradesModule,
  TeamManagersModule,
  TeamsModule,
  MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

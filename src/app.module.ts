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
import { LoginModule } from './login/login.module';


@Module({
  imports: [

    // connecting to mysql server

    // GLOBAL
    
    TypeOrmModule.forRoot({
    type: "mysql",
    host: "us-east.connect.psdb.cloud",
    port: 3306,
    username: "lzu3h4sxxs4lkm0r8yfm",
    password: "pscale_pw_vB7mkdWWECbG1n4ZH1iEkLg1vM18bGI8XAt3myZTPl0",
    database: "result_gen",
    entities: ['dist/**/entities/*.entity{.ts,.js}'],
    synchronize: true,
    ssl:{"rejectUnauthorized":true}
    }),

    // LOCAL
    
  //   TypeOrmModule.forRoot({
  //     type: "mysql",
  //     host: "localhost",
  //     port: 3306,
  //     username: "root",
  //     password: "B@buL@bu123",
  //     database: "resultGen",
  //     entities: ['dist/**/entities/*.entity{.ts,.js}'],
  //     synchronize: true
    
  // }),

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
  LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

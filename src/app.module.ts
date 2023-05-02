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
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CategoryModule } from './category/category.module';
import { SkillModule } from './skill/skill.module';
import { PositionModule } from './position/position.module';
import { CandidateProgrammeModule } from './candidate-programme/candidate-programme.module';
import { ControllersModule } from './controllers/controllers.module';
import { DetailsModule } from './details/details.module';
import { CategorySettingsModule } from './category-settings/category-settings.module';
import { CategorySettings } from './category-settings/entities/category-setting.entity';
import { CamelNamingStrategy } from './utils/naming';


@Module({
  imports: [
    // env configuration

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),


    // connecting to mysql server


    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      // ssl: { "rejectUnauthorized": true },
      // namingStrategy: new SnakeNamingStrategy()
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
    LoginModule,
    DetailsModule,
    CategoryModule,
    SkillModule,
    PositionModule,
    CandidateProgrammeModule,
    ControllersModule,
    CategorySettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

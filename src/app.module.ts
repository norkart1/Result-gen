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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { SkillModule } from './skill/skill.module';
import { PositionModule } from './position/position.module';
import { CandidateProgrammeModule } from './candidate-programme/candidate-programme.module';
import { ControllersModule } from './controllers/controllers.module';
import { DetailsModule } from './details/details.module';
import { CategorySettingsModule } from './category-settings/category-settings.module';


@Module({
  imports: [
    // env configuration

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),


    // connecting to mysql server locally

    // TypeOrmModule.forRoot({
    //   type: "mysql",
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: ['dist/**/entities/*.entity{.ts,.js}'],
    //   synchronize: true,
    //   // ssl: { "rejectUnauthorized": true },
    //   // namingStrategy: new SnakeNamingStrategy()
    // }),

    // connecting to mysql planetscale server

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port:configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities:  ['dist/**/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNC'),
        ssl: { "rejectUnauthorized": true },
        // migrationsTableName: 'migrations',
        // migrations: ['dist/src/database/migrations/*.js'],
        // configService.get<string>('MYSQL_ATTR_SSL_CA') ,
        // cli: {
        //   migrationsDir: 'src/database/migrations',
        // },
        // namingStrategy: new SnakeNamingStrategy(),
        // url:configService.get<string>('DATABASE_URL'),
      }),
      
      inject: [ConfigService],

      
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

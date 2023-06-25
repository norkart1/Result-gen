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
import { TeamsModule } from './teams/teams.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { SkillModule } from './skill/skill.module';
import { PositionModule } from './position/position.module';
import { CandidateProgrammeModule } from './candidate-programme/candidate-programme.module';
import { DetailsModule } from './details/details.module';
import { CategorySettingsModule } from './category-settings/category-settings.module';
import { CredentialsModule } from './credentials/credentials.module';
import { dataSourceOptions } from 'db/data-source';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CustomContextProvider } from './utils/custom';

@Module({
  imports: [
    // env configuration

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // config of JWT

    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   useFactory: async () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '1d' },
    //   }),
    // }),
  


    // connecting to mysql planetscale server

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        // synchronize: true,
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
      context: ({ req , res }) => ({ req, res }),
      playground:{
        settings: {
          'request.credentials': 'include',
        },
      },
      cors: {
        credentials: true,
        origin: true
      }
   
    }),

    CandidatesModule,
    ProgrammesModule,
    SectionsModule,
    GradesModule,
    TeamsModule,
    DetailsModule,
    CategoryModule,
    SkillModule,
    PositionModule,
    CandidateProgrammeModule,
    CategorySettingsModule,
    CredentialsModule,
  ],
  controllers: [AppController],
  providers: [AppService , CustomContextProvider],
})
export class AppModule { }

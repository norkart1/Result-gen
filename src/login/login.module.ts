// import { Module, forwardRef } from '@nestjs/common';
// import { LoginService } from './login.service';
// import { LoginResolver } from './login.resolver';
// import { TeamManagersModule } from 'src/team-managers/team-managers.module';
// import { ControllersModule } from 'src/controllers/controllers.module';
// // import { MediaModule } from 'src/media/media.module';
// import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './local.strategy';

// @Module({
//   imports: [
//     forwardRef(() => TeamManagersModule),
//     forwardRef(() => ControllersModule),
//     // forwardRef(() => MediaModule),
//     PassportModule.register({ defaultStrategy: 'local' }),

//   ],
//   providers: [LoginResolver, LoginService , LocalStrategy],
//   exports: [LoginService],
// })
// export class LoginModule {}

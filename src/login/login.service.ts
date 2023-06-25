// import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { ControllersService } from 'src/controllers/controllers.service';
// // import { MediaService } from 'src/media/media.service';
// import { TeamManagersService } from 'src/team-managers/team-managers.service';
// import { In } from 'typeorm';
// import { LoginInput } from './dto/login-input.input';
// import { LoginResult } from './dto/result-login.input';
// import { Controller } from 'src/controllers/entities/controller.entity';

// @Injectable()
// export class LoginService {
//   constructor(
//     @Inject(forwardRef(() => TeamManagersService))
//     private readonly teamManagersService: TeamManagersService,
//     @Inject(forwardRef(() => ControllersService))
//     private readonly controllersService: ControllersService,
//     // @Inject(forwardRef(() => MediaService))
//     // private readonly mediaService: MediaService,
//   ) {}

//   async hashPassword(password: string) {
//     const salt = bcrypt.genSaltSync(10);
//     // hash the password with bcrypt
//     const hash = await bcrypt.hashSync(password, salt);
//     return hash;
//   }

//   async comparePassword(password: string, hash: string) {
//     // compare password with bcrypt
//     const result = await bcrypt.compareSync(password, hash);
//     return result;
//   }

//   async generateToken() {
//     // generate token'
//     return 'token';
//   }

//   async verifyToken() {
//     // verify token
//   }

//   async validateAdmin(username: string, password: string): Promise<any> {
//     const user = await this.comparePassword(username, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   async validateController(username: string, password: string): Promise<any> {
//     const user = await this.controllersService.findOneByUsername(username);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     // checking the password
//     const isPasswordValid = await this.comparePassword(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }

//   async validateTeamManager(username: string, password: string): Promise<any> {
//     const user = await this.teamManagersService.findOneByUsername(username);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     // checking the password
//     const isPasswordValid = await this.comparePassword(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }

//   // async validateMedia(username: string, password: string): Promise<any> {
//   //   const user = await this.mediaService.findOneByUsername(username);
//   //   if (!user) {
//   //     throw new UnauthorizedException();
//   //   }
//   //   // checking the password
//   //   const isPasswordValid = await this.comparePassword(password, user.password);
//   //   if (!isPasswordValid) {
//   //     throw new UnauthorizedException();
//   //   }
//   //   return user;
//   // }

//   // Login for all users
//   async login(loginInput: LoginInput) {
//     const { username, password, role } = loginInput;
//     const result: LoginResult = {
//       token: await this.generateToken(),
//       controller: null,
//       teamManager: null,
//       // media: null,
//       admin: null,
//     };
//     switch (role) {
//       case 'admin':
//         result.admin = !this.validateAdmin(username, password);
//       case 'controller':
//         result.controller = await this.validateController(username, password);
//       case 'teamManager':
//         result.teamManager = await this.validateTeamManager(username, password);
//       case 'media':
//         // result.media = await this.validateMedia(username, password);
//       default:
//         result.token =await this.generateToken();
        
//     }

//     return result;
//   }
// }

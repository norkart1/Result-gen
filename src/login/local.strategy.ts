// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { LoginService } from './login.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private loginService: LoginService) {
//     super();
//   }
 
//   async validateAdmin(username: string, password: string): Promise<any> {
//     const user = await this.loginService.validateAdmin(username, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }

//   async validateController(username: string, password: string): Promise<any> {
//     const user = await this.loginService.validateController(username, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }

//   async validateTeamManager(username: string, password: string): Promise<any> {
//     const user = await this.loginService.validateTeamManager(username, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }

//   // async validateMedia(username: string, password: string): Promise<any> {
//   //   const user = await this.loginService.validateMedia(username, password);
//   //   if (!user) {
//   //     throw new UnauthorizedException();
//   //   }
//   //   return user;
//   // }

//   // async validate(username: string, password: string , func ): Promise<any> {

//   //   // func is a function 
//   //   const user = await this.loginService.validateMedia(username, password);
//   //   if (!user) {
//   //     throw new UnauthorizedException();
//   //   }
//   //   return user;
   
//   // }

// }

// import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
// import { LoginService } from './login.service';
// import { LoginInput } from './dto/login-input.input';
// import { UseGuards } from '@nestjs/common';
// import { LoginGuard } from './login.guard';
// import { LoginResult } from './dto/result-login.input';

// @Resolver()
// export class LoginResolver {
//   constructor(private readonly loginService: LoginService) {
//   }

//    // Login
//    @Mutation(() => LoginResult , { name: 'login' })
//    @UseGuards(LoginGuard)
//     login(@Args('loginInput') loginInput: LoginInput) : Promise<LoginResult>{
//      return this.loginService.login(loginInput);
//     //  return 1;
//    }
// }

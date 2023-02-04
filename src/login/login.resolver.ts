import { Resolver } from '@nestjs/graphql';
import { LoginService } from './login.service';

@Resolver()
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}
}

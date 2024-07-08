import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'crypto';
import { role } from '../user/dto/createUser.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import { IRequest } from './interfaces/request.interface';

type User = {
  email: string;
  password: string;
  role: role,
}
export interface IAuthenticate {
  readonly user: User;
  readonly token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn({email, password}: AuthenticateDto): Promise<{ access_token: string }> {
    try {

      const user = await this.userService.findOne(email);
      if (user?.password !== password) {
        throw new UnauthorizedException();
      }
      const payload: IRequest["user"] = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }catch(error) {
      throw new UnauthorizedException(error);
    }
  }

 
}
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/database/database-schema';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const users = await this.usersService.findAll();
    const user = users.find((user: User) => {
      return user.email == email;
    });

    if (!user) {
      throw new BadRequestException();
    }

    if (user && user?.password !== pass) {
      throw new UnauthorizedException();
    }
    console.log(user);

    const payload = { sub: user.id, username: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

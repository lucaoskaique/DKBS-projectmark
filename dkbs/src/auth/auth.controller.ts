import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@src/database/database-schema';
import { Public } from '@src/helpers/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: User) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}

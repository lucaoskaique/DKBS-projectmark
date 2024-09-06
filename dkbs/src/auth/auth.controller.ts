import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/database/database-schema';
import { Public } from 'src/helpers/public-route.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: User) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}

  @Post('/signup')
  createUser(@Body() authCredDto: AuthCredentialsDto): Promise<void> {
    return this.userService.signUp(authCredDto);
  }
  @Post('/signin')
  login(
    @Body() authCredDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(authCredDto);
  }
}

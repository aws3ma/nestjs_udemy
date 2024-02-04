import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { compare } from 'bcrypt';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  signUp(authCredDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepo.createUser(authCredDto);
  }
  async signIn(
    authCredDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredDto;
    const user: User = await this.usersRepo.findUserByUsername(username);
    if (user && compare(password, user.password)) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Credentials not match');
    }
  }
}

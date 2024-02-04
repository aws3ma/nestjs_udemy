import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { genSalt, hash } from 'bcrypt';
@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(authCredDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredDto;
    const salt: string = await genSalt();
    const hashedPassword: string = await hash(password, salt);
    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Duplicate username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async findUserByUsername(username: string): Promise<User> {
    const user = await this.findOneBy({ username });
    return user;
  }
}

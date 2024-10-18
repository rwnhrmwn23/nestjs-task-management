import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../../jwt/jwt-payload.interfaces';
import { BaseResponse } from '../../../common/base-response';
import { executeQueryWithLogging } from '../../../common/query-helpers';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  constructor(
    protected dataSource: DataSource,
    private jwtService: JwtService,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<BaseResponse<any>> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
      return executeQueryWithLogging(
        this.logger,
        user.username,
        'createUser()',
        'createUser successfully',
        () => null,
      );
    } catch (error) {
      // duplicate username
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<BaseResponse<any>> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);

      return executeQueryWithLogging(
        this.logger,
        user.username,
        'signIn()',
        'signIn successfully',
        () => Promise.resolve({ accessToken }),
      );
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}

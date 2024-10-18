import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { BaseResponse } from '../../../common/base-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(
    authCredentialSto: AuthCredentialsDto,
  ): Promise<BaseResponse<any>> {
    return this.userRepository.createUser(authCredentialSto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<BaseResponse<any>> {
    return this.userRepository.signIn(authCredentialsDto);
  }
}

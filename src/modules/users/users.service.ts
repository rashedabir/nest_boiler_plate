import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userReposity: UserRepository,
    private jwtService: JwtService,
  ) {}

  //local Registration of user
  async userRegistration(userRegistrationDto: UserRegistrationDto) {
    userRegistrationDto['password'] = bcrypt.hashSync(
      userRegistrationDto.password,
      10,
    );

    const existingUser = await this.userReposity.findOne({
      where: { email: userRegistrationDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('This email is already used.');
    }

    const user = await this.userReposity.save(userRegistrationDto);

    const userPayload: UserPayloadInterface = {
      id: user.id,
      email: user.email,
    };

    const token = await this.signJwtUser(userPayload);

    const payload = {
      firstName: user?.firstName,
      middleName: user?.middleName,
      lastName: user?.lastName,
      email: user?.email,
      access_token: token,
    };

    return payload;
  }

  //local login of user
  async userLogin(userLoginDto: UserLoginDto) {
    const user = await this.userReposity.findOne({
      where: { email: userLoginDto.email },
    });

    if (!user) {
      throw new BadRequestException('This email is not registered.');
    }

    const isMatch = await bcrypt.compare(userLoginDto.password, user?.password);

    if (!isMatch) {
      throw new BadRequestException('Incorrect Password');
    }

    const userPayload: UserPayloadInterface = {
      id: user.id,
      email: user.email,
    };

    const token = await this.signJwtUser(userPayload);

    const payload = {
      firstName: user?.firstName,
      middleName: user?.middleName,
      lastName: user?.lastName,
      email: user?.email,
      access_token: token,
    };

    return payload;
  }

  //generate jwt access token
  async signJwtUser(user: any) {
    const data: UserPayloadInterface = {
      id: user.id,
      email: user.email,
    };
    const signJwt = this.jwtService.sign(data, { expiresIn: '1d' });
    return signJwt;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userReposity.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new BadRequestException('Invalid username/password!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid username/password!');
    }

    return user;
  }
}

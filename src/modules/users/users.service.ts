import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { MediaManagerEntity } from '../media-manager/entities/media-manager.entity';
import { MediaManagerService } from '../media-manager/media-manager.service';
import { UserChangePasswordDto } from './dto/change-password.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserProfileDto } from './dto/user-profile-update.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userReposity: UserRepository,
    private jwtService: JwtService,
    private readonly mediaManagerService: MediaManagerService,
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

  async profileUpdate(
    userProfileDto: UserProfileDto,
    file: any,
    userPayload: UserPayloadInterface,
  ) {
    let media;
    const user = await this.userReposity.findOne({
      where: { id: userPayload.id },
    });

    if (!user) {
      throw new BadRequestException('This user is not registered.');
    }

    if (file) {
      media = await this.mediaManagerService.create(file, userPayload);
    }

    userProfileDto['image'] = media.id;
    delete userProfileDto.profileImage;

    const data = await this.userReposity
      .createQueryBuilder('user')
      .update(UserEntity)
      .set(userProfileDto)
      .where('id = :id', { id: userPayload.id })
      .execute();

    return data.affected > 0 ? 'Raw Updated' : 'Something went wrong';
  }

  async getProfile(userPayload: UserPayloadInterface) {
    const user = await this.userReposity
      .createQueryBuilder('user')
      .leftJoinAndMapOne(
        'user.image',
        MediaManagerEntity,
        'media',
        'user.image = media.id',
      )
      .where('user.id = :id', { id: userPayload.id })
      .select([
        'user.id',
        'user.firstName',
        'user.middleName',
        'user.lastName',
        'media.id',
        'media.name',
        'media.url',
      ])
      .getOne();

    return user;
  }

  async changePassword(
    userChangePasswordDto: UserChangePasswordDto,
    userPayload: UserPayloadInterface,
  ) {
    const user = await this.userReposity.findOne({
      where: { id: userPayload.id },
    });

    if (!user) {
      throw new BadRequestException('This user is not registered.');
    }

    const isMatch = await bcrypt.compare(
      userChangePasswordDto.currentPassword,
      user?.password,
    );

    if (!isMatch) {
      throw new BadRequestException('password doesnt match');
    }

    userChangePasswordDto['newPassword'] = bcrypt.hashSync(
      userChangePasswordDto.newPassword,
      10,
    );

    const data = await this.userReposity
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ password: userChangePasswordDto.newPassword })
      .where('id = :id', { id: userPayload.id })
      .execute();

    return data.affected > 0 ? 'Password Updated' : 'Something went wrong';
  }
}

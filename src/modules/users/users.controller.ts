/**dependencies */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/common/decorators/user.payload.decorator';
import LocalFilesInterceptor from 'src/common/interceptors/local-files.interceptor';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { imageFileFilter } from 'src/engine/utils';
import { UserChangePasswordDto } from './dto/change-password.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserProfileDto } from './dto/user-profile-update.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserAuthService } from './users.service';
/**services */
//swagger doc

@ApiTags('User | Auth')
@Controller({
  //path name
  path: 'user',
  //route version
  version: '1',
})
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  //registration
  @ApiBody({
    type: UserRegistrationDto,
  })
  @Post('registration')
  async registration(@Body() userRegistrationDto: UserRegistrationDto) {
    const userData = await this.userAuthService.userRegistration(
      userRegistrationDto,
    );
    return { message: 'successful', result: userData };
  }

  //login
  @ApiBody({
    type: UserLoginDto,
  })
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const userData = await this.userAuthService.userLogin(userLoginDto);

    return { message: 'successful', result: userData };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UserProfileDto,
  })
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'profileImage',
      path: '/media-manager',
      fileFilter: imageFileFilter,
      size: {
        fileSize: Math.pow(1024, 2), // 1MB
      },
    }),
  )
  @Patch('update')
  async create(
    @Body() userProfileDto: UserProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @UserPayload() userPayload: UserPayloadInterface,
  ) {
    const catData = await this.userAuthService.profileUpdate(
      userProfileDto,
      file,
      userPayload,
    );

    return { message: 'successful', result: catData };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Get('/profile')
  async profile(@UserPayload() userPayload: UserPayloadInterface) {
    const data = await this.userAuthService.getProfile(userPayload);

    return { message: 'successful', result: data };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Post('/change-password')
  async changePass(
    @Body() userChangePasswordDto: UserChangePasswordDto,
    @UserPayload() userPayload: UserPayloadInterface,
  ) {
    const data = await this.userAuthService.changePassword(
      userChangePasswordDto,
      userPayload,
    );

    return { message: 'successful', result: data };
  }
}

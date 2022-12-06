/**dependencies */
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
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
}

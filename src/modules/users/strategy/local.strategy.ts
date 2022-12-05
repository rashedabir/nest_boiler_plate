import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAuthService } from '../users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userAuthService: UserAuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req, email: string, password: string): Promise<any> {
    const usertype = req.body?.userTypeSlug ?? '';
    if (!usertype) {
      throw new NotFoundException('Invalid User type!');
    }
    //validate user
    const user = await this.userAuthService.validateUser(email, password);
    //if no user is found
    if (!user) {
      throw new UnauthorizedException('Invalid email/password.');
    }
    //return the user data
    return user;
  }
}

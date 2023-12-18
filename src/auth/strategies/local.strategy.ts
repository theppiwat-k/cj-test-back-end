import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SigninUserDto } from '../dto/signin-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const bodyDto: SigninUserDto = {
      email: username,
      password: password,
    };
    const user = await this.authService.validateUser(bodyDto);

    if (user === 'User not found') {
      throw new NotFoundException('User not found', 'xxxx');
    }

    if (user === 'Incorrect password') {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }
}

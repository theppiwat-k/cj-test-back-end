import { ForbiddenException, Injectable } from '@nestjs/common';
import { SigninUserDto } from './dto/signin-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareHash, hash } from '../utils/bcrypt';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(user: User, response: Response): Promise<User> {
    const { access_token, refresh_token } = await this.getTokens(user);
    this.setRotationToken(response, access_token, refresh_token);
    return { ...user };
  }

  async signout(userId: number, response: Response): Promise<void> {
    this.clearCookie(response);
    await this.updateRefreshToken(userId, '');
  }

  async getTokens(user: any): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload = {
      user_id: user.id,
      sub: {
        email: user.email,
        username: user.username,
      },
    };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = refreshToken ? await hash(refreshToken) : '';
    await this.usersService.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async refreshToken(
    email: string,
    refreshToken: string,
    response: Response,
  ): Promise<User> {
    const user = await this.usersService.findOne({
      where: {
        email: email,
      },
    });

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await compareHash(
      refreshToken,
      user.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const { access_token, refresh_token } = await this.getTokens(user);

    await this.updateRefreshToken(user.id, refresh_token);

    this.setRotationToken(response, access_token, refresh_token);
    return { ...user };
  }

  setRotationToken(
    response: Response,
    access_token: string,
    refresh_token: string,
  ) {
    response.cookie('access_token', access_token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
    response.cookie('refresh_token', refresh_token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }

  clearCookie(response: Response) {
    response.clearCookie('access_token', {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
    response.clearCookie('refresh_token', {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }

  async validateUser(body: SigninUserDto) {
    const user = await this.usersService.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return 'User not found';
    }
    const hashPassword = user.password;
    const checkPassword = await compareHash(body.password, hashPassword);
    if (!checkPassword) {
      return 'Incorrect password';
    }
    const { refresh_token } = await this.getTokens(user);
    await this.updateRefreshToken(user.id, refresh_token);
    return user;
  }

  fakeFindRefreshToken() {
    return true;
  }
}

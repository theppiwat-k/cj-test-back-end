import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Param,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from '../decorators/public.decorator';
import { Serialize } from '../interceptor/serialize.interceptor';
import { SigninDto } from './dto/signin.dto';
import { JwtRefreshTokenGuard } from './guards/refreshtoken.guard';
import { Response as Express } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @Serialize(SigninDto)
  async signin(@Request() req: any, @Response({ passthrough: true }) res: any) {
    return this.authService.signin(req.user, res);
  }

  @Post('/signout/:userid')
  async signout(
    @Param('userid') userId: string,
    @Response({ passthrough: true }) res: any,
  ) {
    return this.authService.signout(+userId, res);
  }

  @Get('/whoami')
  async whoami(@Response() res: Express) {
    return res.sendStatus(200);
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('/refresh')
  @Serialize(SigninDto)
  async refreshToken(
    @Request() req: any,
    @Response({ passthrough: true }) res: any,
  ) {
    return this.authService.refreshToken(
      req.user.sub.email,
      req.user.refreshToken,
      res,
    );
  }
}

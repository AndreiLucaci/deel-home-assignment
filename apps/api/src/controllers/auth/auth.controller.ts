import { AuthService } from '@app/auth';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserCreateRequestDto, UserLoginRequestDto } from './auth.requests.dto';
import {
  CreateUserResponseDto,
  UserLoginResponseDto,
  UserMeResponseDto,
} from './auth.responses.dto';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserRequest: UserCreateRequestDto,
  ): Promise<CreateUserResponseDto> {
    const result = await this.authService.createUser(createUserRequest);

    return result;
  }

  @Post('login')
  async login(
    @Body() loginRequest: UserLoginRequestDto,
  ): Promise<UserLoginResponseDto> {
    const result = await this.authService.login(loginRequest);

    return result;
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async me(@Request() req: Request): Promise<UserMeResponseDto> {
    const user = req['user'];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

import { AuthService } from '@app/auth';
import { Roles } from '@app/domain';
import { DeelSeeder } from '@app/storage/seeder/deel.seeder';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Claims } from '../../decorators/claims.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { UserCreateResponseDto } from '../auth/auth.responses.dto';
import { AdminCreateRequestDto } from './admin.requests.dto';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { ProfileType } from '@app/domain/entities/profile.model';
import { AllowAnonymous } from '../../decorators/allowAnonymous.decorator';

@Controller('admin')
@ApiTags('Admin Controller')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Claims(Roles.ADMIN)
export class AdminController {
  constructor(
    private deelSeeder: DeelSeeder,
    private authService: AuthService,
  ) {}

  @Post('force-seed')
  async forceSeed(): Promise<void> {
    await this.deelSeeder.seed();
  }

  @Post('register-admin')
  @AllowAnonymous()
  async registerAdmin(
    @Body() adminCreateRequest: AdminCreateRequestDto,
  ): Promise<UserCreateResponseDto> {
    const userCreateRequest: UserCreateRequest = {
      ...adminCreateRequest,
      profession: '',
      type: ProfileType.OTHER,
    };

    const result = await this.authService.createAdmin(userCreateRequest);

    return result;
  }
}

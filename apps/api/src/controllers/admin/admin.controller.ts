import { AdminService } from '@app/admin';
import { AuthService } from '@app/auth';
import { Roles } from '@app/domain';
import { ProfileType } from '@app/domain/entities/profile.model';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { DeelSeeder } from '@app/storage/seeder/deel.seeder';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '../../decorators/allowAnonymous.decorator';
import { Claims } from '../../decorators/claims.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { UserCreateResponseDto } from '../auth/auth.responses.dto';
import {
  AdminCreateRequestDto,
  AdminUserDeleteRequestDto,
} from './admin.requests.dto';
import { AdminUserDeleteResponseDto } from './admin.response.dto';
import { getUserId } from '../../utils/request.utils';
import { ClaimsGuard } from '../../guards/claims.guard';
import { QueryBus } from '@nestjs/cqrs';
import {
  BestProfessionQuery,
  BestProfessionQueryResult,
} from '@app/application/admin/best-profession.query';

@Controller('admin')
@ApiTags('Admin Controller')
@ApiBearerAuth()
@UseGuards(AuthGuard, ClaimsGuard)
export class AdminController {
  constructor(
    // SOA
    private deelSeeder: DeelSeeder,
    private authService: AuthService,
    private adminService: AdminService,
    // CQRS
    private queryBus: QueryBus,
  ) {}

  @Post('force-seed')
  @Claims(Roles.ADMIN)
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

  @Post('delete-user')
  @Claims(Roles.ADMIN)
  async deleteUser(
    @Request() httpReq: Request,
    @Body() request: AdminUserDeleteRequestDto,
  ): Promise<AdminUserDeleteResponseDto> {
    const userId = getUserId(httpReq);

    const result = await this.adminService.softDeleteUser({
      adminId: userId,
      email: request.email,
    });

    return result;
  }

  @Get('best-profession')
  @Claims(Roles.ADMIN)
  async getBestProfession(
    @Query('start') rawStartDate: string,
    @Query('end') rawEndDate: string,
  ): Promise<BestProfessionQueryResult> {
    const startDate = new Date(rawStartDate);
    const endDate = new Date(rawEndDate);

    return this.queryBus.execute(new BestProfessionQuery(startDate, endDate));
  }
}

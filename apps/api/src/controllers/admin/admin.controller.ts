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
  ValidationPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '../../decorators/allowAnonymous.decorator';
import { Claims } from '../../decorators/claims.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { ClaimsGuard } from '../../guards/claims.guard';
import { getUserId } from '../../utils/request.utils';
import { UserCreateResponseDto } from '../auth/auth.responses.dto';
import {
  AdminCreateRequestDto,
  AdminUserDeleteRequestDto,
  DateRangeQueryDto,
  LimitDateRangeQueryDto,
} from './admin.requests.dto';
import { AdminUserDeleteResponseDto } from './admin.response.dto';
import {
  BestClientQueryResultItem,
  BestClientsQuery,
  BestClientsQueryResult,
} from '@app/cqrs/admin/best-clients.query';
import {
  BestProfessionQueryResult,
  BestProfessionQuery,
} from '@app/cqrs/admin/best-profession.query';

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
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: DateRangeQueryDto,
  ): Promise<BestProfessionQueryResult> {
    const { start: startDate, end: endDate } = query;

    return this.queryBus.execute(new BestProfessionQuery(startDate, endDate));
  }

  @Get('best-clients')
  @Claims(Roles.ADMIN)
  async getBestClients(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: LimitDateRangeQueryDto,
  ): Promise<BestClientQueryResultItem[]> {
    const { start: startDate, end: endDate, limit } = query;

    const result = await this.queryBus.execute<
      BestClientsQuery,
      BestClientsQueryResult
    >(new BestClientsQuery(startDate, endDate, limit));

    return result.clients;
  }
}

import { Controller, UseGuards, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { DeelSeeder } from '@app/storage/seeder/deel.seeder';

@Controller('admin')
@ApiTags('Admin Controller')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private deelSeeder: DeelSeeder) {}

  @Post('force-seed')
  async forceSeed(): Promise<void> {
    await this.deelSeeder.seed();
  }
}

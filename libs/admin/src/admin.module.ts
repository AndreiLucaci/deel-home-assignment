import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { StorageModule } from '@app/storage';

@Module({
  imports: [StorageModule],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

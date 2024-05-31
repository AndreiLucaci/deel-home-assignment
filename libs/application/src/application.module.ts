import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './contracts/queries';
import { StorageModule } from '@app/storage';

@Module({
  imports: [CqrsModule, StorageModule],
  providers: [ApplicationService, ...QueryHandlers],
  exports: [ApplicationService, ...QueryHandlers],
})
export class ApplicationModule {}

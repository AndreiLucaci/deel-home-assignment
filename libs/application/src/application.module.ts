import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CqrsModule } from '@nestjs/cqrs';
import { StorageModule } from '@app/storage';
import { KnownQueryHandlers } from './known-queries';

@Module({
  imports: [CqrsModule, StorageModule],
  providers: [ApplicationService, ...KnownQueryHandlers],
  exports: [ApplicationService, ...KnownQueryHandlers],
})
export class ApplicationModule {}

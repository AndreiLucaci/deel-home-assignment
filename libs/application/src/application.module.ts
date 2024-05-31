import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CqrsModule } from '@nestjs/cqrs';
import { StorageModule } from '@app/storage';
import { KnownQueryHandlers } from './known-queries';
import { KnownCommandHandlers } from './known-commands';

@Module({
  imports: [CqrsModule, StorageModule],
  providers: [
    ApplicationService,
    ...KnownQueryHandlers,
    ...KnownCommandHandlers,
  ],
  exports: [ApplicationService, ...KnownQueryHandlers, ...KnownCommandHandlers],
})
export class ApplicationModule {}

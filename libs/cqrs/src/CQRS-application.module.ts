import { Module } from '@nestjs/common';
import { CQRSApplicationService } from './CQRS-application.service';
import { CqrsModule } from '@nestjs/cqrs';
import { StorageModule } from '@app/storage';
import { KnownQueryHandlers } from './known-queries';
import { KnownCommandHandlers } from './known-commands';

@Module({
  imports: [CqrsModule, StorageModule],
  providers: [
    CQRSApplicationService,
    ...KnownQueryHandlers,
    ...KnownCommandHandlers,
  ],
  exports: [
    CQRSApplicationService,
    ...KnownQueryHandlers,
    ...KnownCommandHandlers,
  ],
})
export class CQRSApplicationModule {}

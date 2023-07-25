import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsResolver } from './feeds.resolver';

@Module({
  providers: [FeedsResolver, FeedsService]
})
export class FeedsModule {}

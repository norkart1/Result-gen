import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsResolver } from './sections.resolver';

@Module({
  providers: [SectionsResolver, SectionsService]
})
export class SectionsModule {}

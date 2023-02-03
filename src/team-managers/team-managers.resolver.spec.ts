import { Test, TestingModule } from '@nestjs/testing';
import { TeamManagersResolver } from './team-managers.resolver';
import { TeamManagersService } from './team-managers.service';

describe('TeamManagersResolver', () => {
  let resolver: TeamManagersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamManagersResolver, TeamManagersService],
    }).compile();

    resolver = module.get<TeamManagersResolver>(TeamManagersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

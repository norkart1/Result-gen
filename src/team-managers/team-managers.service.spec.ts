import { Test, TestingModule } from '@nestjs/testing';
import { TeamManagersService } from './team-managers.service';

describe('TeamManagersService', () => {
  let service: TeamManagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamManagersService],
    }).compile();

    service = module.get<TeamManagersService>(TeamManagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

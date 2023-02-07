import { Test, TestingModule } from '@nestjs/testing';
import { ControllersResolver } from './controllers.resolver';
import { ControllersService } from './controllers.service';

describe('ControllersResolver', () => {
  let resolver: ControllersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControllersResolver, ControllersService],
    }).compile();

    resolver = module.get<ControllersResolver>(ControllersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

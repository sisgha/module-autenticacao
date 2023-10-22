import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../../domain';

@Injectable()
export class EnvironmentConfigService implements IConfig {
  constructor(
    // ...
    private configService: ConfigService,
  ) {}
}

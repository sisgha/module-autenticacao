import { Provider } from '@nestjs/common';
import { ISISGEANestSSOContext, SISGEA_NEST_SSO_CONTEXT } from '@sisgea/nest-sso';
import { EnvironmentConfigService } from '../../../environment-config/environment-config.service';

export const sisgeaNestSSOContextProvider: Provider<ISISGEANestSSOContext> = {
  provide: SISGEA_NEST_SSO_CONTEXT,

  useFactory: (environmentConfigService: EnvironmentConfigService) => {
    const sisgeaNestSSOContext: ISISGEANestSSOContext = {
      configService: environmentConfigService,
    };

    return sisgeaNestSSOContext;
  },

  inject: [EnvironmentConfigService],
};

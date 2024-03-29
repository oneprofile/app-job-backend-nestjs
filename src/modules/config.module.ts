import { Module } from '@nestjs/common';
import { KeycloakConfigService } from '../environment/keycloak.config';

@Module({
  providers: [KeycloakConfigService],
  exports: [KeycloakConfigService],
})
export class ConfigModule {}

import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database.module';
import { AuthenticationModule } from './modules/authentication.module';
import { SignupComponentModule } from './modules/signup.component.module';
import { JobComponentModule } from './modules/job.component.module';

import backendConfig from './environment/backend.config';
import { HelloController } from './interface/hello/hello.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/backend.env',
      load: [backendConfig],
      isGlobal: true,
    }),
    AuthenticationModule,
    DatabaseModule,
    SignupComponentModule,
    JobComponentModule,
  ],
  controllers: [HelloController],
})
export class AppModule {}
